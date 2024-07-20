﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Manga.Server.Data;
using Manga.Server.Models;
using Microsoft.AspNetCore.Identity;
using System.Net.Http;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Security.Policy;
using System.Web;
using System.Xml;
using System.Xml.XPath;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;
        private readonly HttpClient _httpClient;
        private readonly ILogger<SellsController> _logger;
        private readonly S3Service _s3Service;
        private static readonly Dictionary<string, string> TitleNormalizationMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "one piece", "ONE PIECE" },
            { "ワンピース", "ONE PIECE" },
            { "遊・戯・王ゼアル", "遊・戯・王ZEXAL" },
            // 他の特別な変換ルールをここに追加できます
        };

        public SellsController(ApplicationDbContext context, UserManager<UserAccount> userManager, IHttpClientFactory httpClientFactory, ILogger<SellsController> logger, S3Service s3Service)
        {
            _context = context;
            _userManager = userManager;
            _httpClient = httpClientFactory.CreateClient();
            _logger = logger;
            _s3Service = s3Service;
        }

        // GET: api/Sells
        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sell>>> GetSell()
        {
            return await _context.Sell.ToListAsync();
        }
        */
        [HttpGet]
        public async Task<ActionResult<List<HomeDto>>> GetHomeDataAsync()
        {
            var userId = _userManager.GetUserId(User);

            // 現在のユーザーのOwnedListのタイトルリストを取得
            var ownedTitles = await _context.OwnedList
                                             .Where(o => o.UserAccountId == userId)
                                             .Select(o => o.Title)
                                             .ToListAsync();

            // 現在のユーザーのSellのタイトルリストも取得
            var sellTitles = await _context.Sell
                                            .Where(s => s.UserAccountId == userId)
                                            .Select(s => s.Title)
                                            .ToListAsync();

            // 両方のリストを結合
            var userTitles = ownedTitles.Union(sellTitles).ToList();

            var sells = await _context.Sell
                          .Include(s => s.SellImages)
                          .Where(s => s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established)
                          .OrderByDescending(s => s.SellTime)
                          .ToListAsync();

            var homeDtos = new List<HomeDto>();

            foreach (var sell in sells)
            {
                var wishTitles = await _context.WishList
                                               .Where(w => w.UserAccountId == sell.UserAccountId)
                                               .Select(w => new WishTitleInfo
                                               {
                                                   Title = w.Title,
                                                   IsOwned = userTitles.Contains(w.Title)
                                               })
                                               .OrderByDescending(w => w.IsOwned)
                                               .ToListAsync();

                var dto = new HomeDto
                {
                    SellId = sell.SellId,
                    SellTitle = sell.Title,
                    NumberOfBooks = sell.NumberOfBooks,
                    WishTitles = wishTitles,
                    SellImage = sell.SellImages
                                    .OrderBy(si => si.Order)
                                    .FirstOrDefault()?.ImageUrl
                };

                homeDtos.Add(dto);
            }

            return homeDtos;
        }

        [HttpGet("SearchByTitle")]
        public async Task<ActionResult<List<HomeDto>>> SearchSellsByTitleAsync([FromQuery] string title)
        {
            var userId = _userManager.GetUserId(User);

            // 現在のユーザーのownedTitlesのリストを取得
            var ownedTitles = await _context.OwnedList
                .Where(o => o.UserAccountId == userId)
                .Select(o => o.Title)
                .ToListAsync();

            // 現在のユーザーのSellのタイトルリストも取得
            var sellTitles = await _context.Sell
                                            .Where(s => s.UserAccountId == userId)
                                            .Select(s => s.Title)
                                            .ToListAsync();

            // 両方のリストを結合
            var userTitles = ownedTitles.Union(sellTitles).ToList();

            // 直接一致するSellのレコードを取得
            var matchingSells = await _context.Sell
                .Include(s => s.SellImages)
                .Where(s => s.Title.Contains(title) && (s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established))
                .Where(s => s.Title.Contains(title))
                .ToListAsync();

            // 検索タイトルがWishListテーブルのタイトルと同じだったユーザーのIdを取得
            var wishMatchingUserIds = await _context.WishList
                .Where(w => w.Title == title)
                .Select(w => w.UserAccountId)
                .ToListAsync();

            // wishMatchingUserIdsに含まれるユーザーのSellのレコードを取得
            var wishMatchingSells = await _context.Sell
                .Include(s => s.SellImages)
                .Where(s => wishMatchingUserIds.Contains(s.UserAccountId) && (s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established))
                .ToListAsync();

            // リストを結合し、SellTimeの降順で並び替え
            var allMatchingSells = matchingSells.Concat(wishMatchingSells)
                .Distinct()
                .OrderByDescending(s => s.SellTime)
                .ToList();

            // allMatchingSellsに基づいてHomeDtoのリストを作成
            var homeDtos = allMatchingSells.Select(sell => new HomeDto
            {
                SellId = sell.SellId,
                SellTitle = sell.Title,
                NumberOfBooks = sell.NumberOfBooks,
                WishTitles = _context.WishList
                    .Where(w => w.UserAccountId == sell.UserAccountId)
                    .Select(w => new WishTitleInfo
                    {
                        Title = w.Title,
                        IsOwned = userTitles.Contains(w.Title)
                    })
                    .OrderByDescending(w => w.IsOwned)
                    .ToList(),
                SellImage = sell.SellImages.OrderBy(si => si.Order).FirstOrDefault()?.ImageUrl
            }).ToList();

            return homeDtos;
        }

        [HttpGet("SearchByTitleForExchange")]
        public async Task<ActionResult<List<HomeDto>>> SearchSellsByTitleForExchangeAsync([FromQuery] string title)
        {
            var userId = _userManager.GetUserId(User);

            // 現在のユーザーのownedTitlesのリストを取得
            var ownedTitles = await _context.OwnedList
                .Where(o => o.UserAccountId == userId)
                .Select(o => o.Title)
                .ToListAsync();

            // 現在のユーザーのSellのタイトルリストも取得
            var sellTitles = await _context.Sell
                .Where(s => s.UserAccountId == userId)
                .Select(s => s.Title)
                .ToListAsync();

            // 両方のリストを結合
            var userTitles = ownedTitles.Union(sellTitles).ToList();

            // 検索タイトルがWishListテーブルのタイトルと同じだったユーザーのIdを取得
            var wishMatchingUserIds = await _context.WishList
                .Where(w => w.Title == title)
                .Select(w => w.UserAccountId)
                .ToListAsync();

            // wishMatchingUserIdsに含まれるユーザーのSellのレコードを取得
            var wishMatchingSells = await _context.Sell
                .Include(s => s.SellImages)
                .Where(s => wishMatchingUserIds.Contains(s.UserAccountId) && (s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established))
                .OrderByDescending(s => s.SellTime)
                .ToListAsync();

            // wishMatchingSellsに基づいてHomeDtoのリストを作成
            var homeDtos = wishMatchingSells.Select(sell => new HomeDto
            {
                SellId = sell.SellId,
                SellTitle = sell.Title,
                NumberOfBooks = sell.NumberOfBooks,
                WishTitles = _context.WishList
                    .Where(w => w.UserAccountId == sell.UserAccountId)
                    .Select(w => new WishTitleInfo
                    {
                        Title = w.Title,
                        IsOwned = userTitles.Contains(w.Title)
                    })
                    .OrderByDescending(w => w.IsOwned)
                    .ToList(),
                SellImage = sell.SellImages.OrderBy(si => si.Order).FirstOrDefault()?.ImageUrl
            }).ToList();

            return homeDtos;
        }

        [HttpGet("MyFavorite")]
        public async Task<ActionResult<List<HomeDto>>> GetMyListSellsAsync()
        {
            var userId = _userManager.GetUserId(User);

            // 現在のユーザーのOwnedListのタイトルリストを取得
            var ownedTitles = await _context.OwnedList
                                             .Where(o => o.UserAccountId == userId)
                                             .Select(o => o.Title)
                                             .ToListAsync();

            // 現在のユーザーのSellのタイトルリストも取得
            var sellTitles = await _context.Sell
                                            .Where(s => s.UserAccountId == userId)
                                            .Select(s => s.Title)
                                            .ToListAsync();

            // 両方のリストを結合
            var userTitles = ownedTitles.Union(sellTitles).ToList();

            // 現在のユーザーがMyListに登録したSellのIDを取得
            var myListSellIds = await _context.MyList
                .Where(m => m.UserAccountId == userId)
                .Select(m => m.SellId)
                .ToListAsync();

            // 上記IDを使用して、Sellの詳細を取得
            var sells = await _context.Sell
                .Include(s => s.SellImages)
                .Where(s => myListSellIds.Contains(s.SellId) && (s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established))
                .OrderByDescending(s => s.SellTime)
                .ToListAsync();

            var homeDtos = new List<HomeDto>();

            foreach (var sell in sells)
            {
                var wishTitles = await _context.WishList
                                               .Where(w => w.UserAccountId == sell.UserAccountId)
                                               .Select(w => new WishTitleInfo
                                               {
                                                   Title = w.Title,
                                                   IsOwned = userTitles.Contains(w.Title)
                                               })
                                               .OrderByDescending(w => w.IsOwned)
                                               .ToListAsync();

                var dto = new HomeDto
                {
                    SellId = sell.SellId,
                    SellTitle = sell.Title,
                    NumberOfBooks = sell.NumberOfBooks,
                    WishTitles = wishTitles,
                    SellImage = sell.SellImages
                                    .OrderBy(si => si.Order)
                                    .FirstOrDefault()?.ImageUrl
                };

                homeDtos.Add(dto);
            }

            return homeDtos;
        }

        [HttpGet("Recommend")]
        public async Task<ActionResult<List<HomeDto>>> GetRecommendedSellsAsync()
        {
            var userId = _userManager.GetUserId(User);

            // 1. ユーザーの所有タイトルとWishリストを一度のクエリで取得
            var userTitlesAndWishes = await (from u in _context.Users
                                             where u.Id == userId
                                             select new
                                             {
                                                 OwnedTitles = u.OwnedLists.Select(o => o.Title),
                                                 SellTitles = u.Sells.Select(s => s.Title),
                                                 WishTitles = u.WishLists.Select(w => w.Title)
                                             }).FirstOrDefaultAsync();

            if (userTitlesAndWishes == null)
                return NotFound("User not found");

            var userTitles = userTitlesAndWishes.OwnedTitles.Union(userTitlesAndWishes.SellTitles).ToHashSet();
            var wishTitles = userTitlesAndWishes.WishTitles.ToHashSet();

            // 2. 推奨される出品を一度のクエリで取得
            var recommendedSells = await _context.Sell
                .Include(s => s.SellImages)
                .Include(s => s.UserAccount.WishLists)
                .Where(s => s.UserAccountId != userId &&
                            (s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established))
                .OrderByDescending(s => wishTitles.Contains(s.Title) && s.UserAccount.WishLists.Any(w => userTitles.Contains(w.Title)))
                .ThenByDescending(s => wishTitles.Contains(s.Title))
                .ThenByDescending(s => s.UserAccount.WishLists.Any(w => userTitles.Contains(w.Title)))
                .ThenByDescending(s => s.SellTime)
                .Select(s => new HomeDto
                {
                    SellId = s.SellId,
                    SellTitle = s.Title,
                    NumberOfBooks = s.NumberOfBooks,
                    WishTitles = s.UserAccount.WishLists
                        .Select(w => new WishTitleInfo
                        {
                            Title = w.Title,
                            IsOwned = userTitles.Contains(w.Title)
                        })
                        .OrderByDescending(w => w.IsOwned)
                        .ToList(),
                    SellImage = s.SellImages
                        .OrderBy(si => si.Order)
                        .FirstOrDefault().ImageUrl
                })
                .ToListAsync();

            return recommendedSells;
        }

        /*
        // GET: api/Sells/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sell>> GetSell(int id)
        {
            var sell = await _context.Sell.FindAsync(id);

            if (sell == null)
            {
                return NotFound();
            }

            return sell;
        }
        */

        [HttpGet("{id}")]
        public async Task<ActionResult<SellDetailsDto>> GetSellDetails(int id)
        {
            var userId = _userManager.GetUserId(User); // 現在のユーザーIDを取得
            var sell = await _context.Sell
                .Include(s => s.UserAccount)
                .Include(s => s.SellImages)
                .Include(s => s.MyLists)
                .FirstOrDefaultAsync(s => s.SellId == id);

            if (sell == null)
            {
                return NotFound();
            }

            bool isPublic = sell.SellStatus == SellStatus.Recruiting || sell.SellStatus == SellStatus.Established;
            bool isOwner = sell.UserAccountId == userId;

            if (!isPublic && !isOwner)
            {
                return NotFound();
            }

            RequestButtonStatus requestStatus;
            if (sell.SellStatus == SellStatus.Established) // 既にマッチングが成立している場合
            {
                requestStatus = RequestButtonStatus.Matched;
            }
            else if (sell.UserAccountId == userId)
            {
                requestStatus = RequestButtonStatus.OwnSell;
            }
            else
            {
                var userRequests = await _context.Request
                    .Where(r => r.RequesterId == userId && r.ResponderSellId == id)
                    .ToListAsync();

                if (userRequests.Any())
                {
                    if (userRequests.Any(r => r.Status == RequestStatus.Withdrawn))
                    {
                        requestStatus = RequestButtonStatus.CanRequest;
                    }
                    else
                    {
                        requestStatus = RequestButtonStatus.AlreadyRequested;
                    }
                }
                else
                {
                    requestStatus = RequestButtonStatus.CanRequest;
                }
            }

            // 出品者のWishListを取得
            var wishLists = await _context.WishList
                .Where(w => w.UserAccountId == sell.UserAccountId)
                .ToListAsync();

            // 現在のユーザーのOwnedListに含まれるタイトルのリストを取得
            var ownedTitles = await _context.OwnedList
                .Where(m => m.UserAccountId == userId)
                .Select(m => m.Title)
                .ToListAsync();

            // 現在のユーザーのSellのタイトルリストも取得
            var sellTitles = await _context.Sell
                                            .Where(s => s.UserAccountId == userId)
                                            .Select(s => s.Title)
                                            .ToListAsync();

            // 両方のリストを結合
            var userTitles = ownedTitles.Union(sellTitles).ToList();

            // WishListからWishTitleInfoリストを作成
            var wishTitles = wishLists
                .Select(wl => new WishTitleInfo
                {
                    Title = wl.Title,
                    IsOwned = userTitles.Contains(wl.Title)
                })
                .OrderByDescending(w => w.IsOwned)
                .ToList();

            var replies = await _context.Reply
                .Where(r => r.SellId == id)
                .OrderByDescending(r => r.Created) // 最新の返信から
                .Take(3) // 上位3件のみ
                .Select(r => new ReplyDto
                {
                    ReplyId = r.ReplyId,
                    NickName = r.UserAccount.NickName,
                    ProfileIcon = r.UserAccount.ProfileIcon,
                    Message = r.Message,
                    Created = r.Created,
                })
                .ToListAsync();

            var replyCount = await _context.Reply
                .Where(r => r.SellId == id)
                .CountAsync();

            // いいね！の情報を取得
            bool isLiked = sell.MyLists.Any(ml => ml.UserAccountId == userId);
            int likeCount = sell.MyLists.Count;

            var dto = new SellDetailsDto
            {
                SellId = sell.SellId,
                Title = sell.Title,
                SendPrefecture = sell.SendPrefecture.GetDisplayName(),
                SendDay = sell.SendDay.GetDisplayName(),
                SellTime = sell.SellTime,
                BookState = sell.BookState.GetDisplayName(),
                NumberOfBooks = sell.NumberOfBooks,
                SellMessage = sell.SellMessage,
                SellStatus = sell.SellStatus,
                UserName = sell.UserAccount.NickName,
                ProfileIcon = sell.UserAccount.ProfileIcon,
                HasIdVerificationImage = !string.IsNullOrEmpty(sell.UserAccount.IdVerificationImage),
                ImageUrls = sell.SellImages.OrderBy(si => si.Order).Select(si => si.ImageUrl).ToList(),
                WishTitles = wishTitles,
                Replies = replies,
                ReplyCount = replyCount,
                IsLiked = isLiked,
                LikeCount = likeCount,
                RequestButtonStatus = requestStatus
            };

            return dto;
        }
        


        // PUT: api/Sells/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSell(int id, Sell sell)
        {
            if (id != sell.SellId)
            {
                return BadRequest();
            }

            _context.Entry(sell).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SellExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        */

        // POST: api/Sells
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*
        [HttpPost]
        public async Task<ActionResult<Sell>> PostSell(Sell sell)
        {
            _context.Sell.Add(sell);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSell", new { id = sell.SellId }, sell);
        }
        */
        [HttpPost]
        public async Task<IActionResult> CreateSell([FromForm] SellCreateDto sellCreateDto)
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var sell = new Sell
            {
                Title = sellCreateDto.Title,
                SendPrefecture = sellCreateDto.SendPrefecture,
                SendDay = sellCreateDto.SendDay,
                BookState = sellCreateDto.BookState,
                NumberOfBooks = sellCreateDto.NumberOfBooks,
                SellMessage = sellCreateDto.SellMessage,
                SellStatus = sellCreateDto.SellStatus,
                SellTime = DateTime.UtcNow,
                UserAccountId = userId
            };

            _context.Sell.Add(sell);
            await _context.SaveChangesAsync();

            var sellImages = new List<SellImage>();

            if (sellCreateDto.SellImages != null)
            {

                foreach (var imageDto in sellCreateDto.SellImages)
                {
                    var imageUrl = await _s3Service.ProcessMangaImageAsync(imageDto.ImageBlob);
                    sellImages.Add(new SellImage
                    {
                        ImageUrl = imageUrl,
                        Order = (int)imageDto.Order,
                    });
                }
            }

            sell.SellImages = sellImages;

            foreach (var sellImage in sellImages)
            {
                sellImage.SellId = sell.SellId;
                _context.SellImage.Add(sellImage);
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSellDetails), new { id = sell.SellId }, new { id = sell.SellId, status = sell.SellStatus });
        }

        [HttpGet("Drafts")]
        public async Task<ActionResult<IEnumerable<SellInfoDto>>> GetDrafts()
        {
            // 現在のユーザーIDを取得
            var userId = _userManager.GetUserId(User);

            // 自分の下書きのみをフィルタリング
            var drafts = await _context.Sell
                .Where(s => s.SellStatus == SellStatus.Draft && s.UserAccountId == userId)
                .Select(s => new SellInfoDto
                {
                    SellId = s.SellId,
                    Title = s.Title,
                    ImageUrl = s.SellImages
                        .OrderBy(si => si.Order)
                        .Select(si => si.ImageUrl)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(drafts);
        }

        [HttpGet("EditDraft/{Id}")]
        public async Task<ActionResult<SellCreateDto>> GetDraftForEdit(int Id)
        {
            var userId = _userManager.GetUserId(User);

            // sellIdとuserIdが一致し、SellStatusがDraftのSellを取得
            var sell = await _context.Sell
                .Include(s => s.SellImages)
                .Where(s => s.SellId == Id && s.UserAccountId == userId)
                .FirstOrDefaultAsync();

            if (sell == null)
            {
                return NotFound();
            }

            // SellCreateDtoにマッピング
            var sellCreateDto = new SellCreateDto
            {
                SellId=Id,
                Title = sell.Title,
                SendPrefecture = sell.SendPrefecture,
                SendDay = sell.SendDay,
                BookState = sell.BookState,
                NumberOfBooks = sell.NumberOfBooks,
                SellMessage = sell.SellMessage,
                SellStatus = sell.SellStatus,
                SellImages = sell.SellImages
                    .OrderBy(si => si.Order)
                    .Select(si => new SellImageCreateDto
                    {
                        ImageUrl = si.ImageUrl,
                        Order = si.Order
                    }).ToList()
            };

            return Ok(sellCreateDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSell(int id, [FromForm] SellCreateDto sellUpdateDto)
        {
            var sell = await _context.Sell.Include(s => s.SellImages).FirstOrDefaultAsync(s => s.SellId == id);

            if (sell == null)
            {
                return NotFound();
            }

            sell.Title = sellUpdateDto.Title;
            sell.SendPrefecture = sellUpdateDto.SendPrefecture;
            sell.SendDay = sellUpdateDto.SendDay;
            sell.BookState = sellUpdateDto.BookState;
            sell.NumberOfBooks = sellUpdateDto.NumberOfBooks;
            sell.SellMessage = sellUpdateDto.SellMessage;
            sell.SellStatus = sellUpdateDto.SellStatus;
            sell.SellTime = DateTime.UtcNow;

            // nullチェックを追加してデフォルトの空リストを使用
            var sellImages = sellUpdateDto.SellImages ?? new List<SellImageCreateDto>();

            // 既存の画像を取得
            var existingImages = sell.SellImages.ToDictionary(si => si.ImageUrl);

            // 削除対象の画像URLを取得
            var imagesToDelete = existingImages.Keys.Except(sellImages.Select(si => si.ImageUrl)).ToList();

            foreach (var imageUrl in imagesToDelete)
            {
                // 画像のURLからファイル名を抽出
                var fileName = Path.GetFileName(imageUrl);
                // S3から画像を削除
                await _s3Service.DeleteFileFromS3Async(fileName, "manga-img-bucket");

                // データベースから画像レコードを削除
                var imageToDelete = existingImages[imageUrl];
                _context.SellImage.Remove(imageToDelete);
            }

            foreach (var imageDto in sellImages)
            {
                if (!string.IsNullOrEmpty(imageDto.ImageUrl))
                {
                    // 既存の画像のorderを更新
                    if (existingImages.ContainsKey(imageDto.ImageUrl))
                    {
                        var existingImage = existingImages[imageDto.ImageUrl];
                        existingImage.Order = (int)imageDto.Order;
                    }
                }
                else
                {
                    // 新しい画像をS3にアップロードし、追加
                    var imageUrl = await _s3Service.ProcessMangaImageAsync(imageDto.ImageBlob);
                    var newImage = new SellImage
                    {
                        ImageUrl = imageUrl,
                        Order = (int)imageDto.Order,
                        SellId = sell.SellId
                    };
                    sell.SellImages.Add(newImage);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { id = sell.SellId, status = sell.SellStatus });
        }


        // DELETE: api/Sells/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSell(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var sell = await _context.Sell.FindAsync(id);
                if (sell == null)
                {
                    return NotFound();
                }

                // この Sell に関連する保留中のRequestを取得
                var relatedRequests = await _context.Request
                    .Where(r => r.RequesterSellId == id && r.Status == RequestStatus.Pending)
                    .ToListAsync();

                // ResponderSellIdをグループ化して、各ResponderSellのDeletedRequestCountを更新
                var responderSellUpdates = relatedRequests
                    .GroupBy(r => r.ResponderSellId)
                    .Select(g => new
                    {
                        ResponderSellId = g.Key,
                        DeletedRequestCount = g.Count()
                    })
                    .ToList();

                foreach (var update in responderSellUpdates)
                {
                    var responderSell = await _context.Sell.FindAsync(update.ResponderSellId);
                    if (responderSell != null)
                    {
                        responderSell.DeletedRequestCount += update.DeletedRequestCount;
                    }
                }

                // Sellを削除
                _context.Sell.Remove(sell);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // ログにエラー詳細を記録
                _logger.LogError(ex, "Sellの削除中にエラーが発生しました。SellId: {SellId}", id);
                return StatusCode(500, "Sellの削除中にエラーが発生しました。");
            }
        }

        /*
        [HttpGet("Request")]
        public async Task<ActionResult<ExchangeRequestDto>> GetMatchingTitles(int sellId)
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var sell = await _context.Sell.Include(s => s.UserAccount).FirstOrDefaultAsync(s => s.SellId == sellId);
            if (sell == null)
            {
                return NotFound();
            }

            var wishListTitles = await _context.WishList
                .Where(w => w.UserAccountId == sell.UserAccountId)
                .Select(w => w.Title)
                .ToListAsync();

            // SellとOwnedListの両方からタイトルを取得し、どちらからのタイトルかも記録します
            var sellTitles = await _context.Sell
                .Where(s => s.UserAccountId == userId)
                .Select(s => new TitleInfo { Title = s.Title, IsFromSell = true })
                .ToListAsync();

            var ownedListTitles = await _context.OwnedList
                .Where(o => o.UserAccountId == userId)
                .Select(o => new TitleInfo { Title = o.Title, IsFromSell = false })
                .ToListAsync();

            // 両リストを結合
            var userTitles = sellTitles.Union(ownedListTitles).ToList();

            // WishListとマッチングするタイトルを見つけます
            var matchingTitles = userTitles.Where(ut => wishListTitles.Contains(ut.Title)).ToList();

            var dto = new ExchangeRequestDto
            {
                SellId = sellId,
                MatchingTitles = matchingTitles
            };

            return dto;
        }
        */
        [HttpGet("Request")]
        public async Task<ActionResult<ExchangeRequestDto>> GetMatchingTitles(int sellId)
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var sell = await _context.Sell.Include(s => s.UserAccount).FirstOrDefaultAsync(s => s.SellId == sellId);
            if (sell == null)
            {
                return NotFound();
            }

            var wishListTitles = await _context.WishList
                .Where(w => w.UserAccountId == sell.UserAccountId)
                .Select(w => w.Title)
                .ToListAsync();

            // Sellからのタイトル
            var sellTitles = await _context.Sell
                .Where(s => s.UserAccountId == userId && wishListTitles.Contains(s.Title))
                .Select(s => new TitleInfo { Title = s.Title })
                .ToListAsync();

            // OwnedListからのタイトル
            var ownedListTitles = await _context.OwnedList
                .Where(o => o.UserAccountId == userId && wishListTitles.Contains(o.Title))
                .Select(o => new TitleInfo { Title = o.Title })
                .ToListAsync();

            var dto = new ExchangeRequestDto
            {
                SellId = sellId,
                SellTitles = sellTitles,
                OwnedListTitles = ownedListTitles
            };

            return dto;
        }

        /*
        [HttpGet("search")]
        public async Task<IActionResult> SearchMangaTitles(string query)
        {

            try
            {

                var encodedQuery = Uri.EscapeDataString(query);

                var apiUrl = $"https://ndlsearch.ndl.go.jp/api/sru?operation=searchRetrieve&query=title%20any%20%22{encodedQuery}%22&recordSchema=dcndl&maximumRecords=10";

                using var response = await _httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {

                    var responseBody = await response.Content.ReadAsStringAsync();

                    _logger.LogInformation("Response XML: {ResponseBody}", responseBody);

                    var xdoc = XDocument.Parse(responseBody);

                    try
                    {
                        var ns = XNamespace.Get("http://ndl.go.jp/dcndl/terms/");
                        var dcTermsNs = XNamespace.Get("http://purl.org/dc/terms/");

                        var titles = xdoc.Descendants(ns + "BibResource")
                            .Elements(dcTermsNs + "title")
                            .Select(e => e.Value)
                            .ToList();

                        _logger.LogInformation("Titles: {@Titles}", titles);

                        return Ok(titles);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "An error occurred while parsing the XML response.");
                        return StatusCode(500, "An error occurred while parsing the XML response.");
                    }

                }
                else
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Error occurred while fetching data from API. Status code: {StatusCode}, Error body: {ErrorBody}", response.StatusCode, errorBody);
                    return StatusCode((int)response.StatusCode, "An error occurred while fetching data from the API.");
                }

            }
            catch (Exception ex)

            {
                _logger.LogError(ex, "An error occurred while processing the request.");
                return StatusCode(500, "An internal server error occurred.");
            }

        }
        */
        [HttpGet("search")]
        public async Task<IActionResult> SearchTitles(string title)
        {
            try
            {
                //var encodedTitle = Uri.EscapeDataString(title);
                var encodedNdc = 726.1;
                var dpid = "iss-ndl-opac-bib";
                var mediatype = "booklet";
                var apiUrl = $"https://ndlsearch.ndl.go.jp/api/opensearch?dpid={dpid}&title={title}&ndc={encodedNdc}&cnt=270";


                using var client = new HttpClient();
                var response = await client.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    var xml = await response.Content.ReadAsStringAsync();
                    var doc = XDocument.Parse(xml);
                    var nsm = new XmlNamespaceManager(new NameTable());
                    nsm.AddNamespace("dc", "http://purl.org/dc/elements/1.1/");

                    var titleCounts = doc.XPathSelectElements("//item/title", nsm)
                        .Select(e => NormalizeTitle(e.Value.TrimEnd('.')))
                        .OrderBy(t => t.Length)
                        .GroupBy(t => t, StringComparer.OrdinalIgnoreCase)
                        .Select(g => new { Title = g.OrderByDescending(t => t).First(), Count = g.Count() })
                        .OrderByDescending(x => x.Count)
                        .ToList();

                    return Ok(titleCounts);
                }
                else
                {
                    return StatusCode((int)response.StatusCode, "An error occurred while fetching data from the API.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the request.");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        [HttpGet("MySell")]
        [Authorize]
        public async Task<ActionResult<List<MySellDto>>> GetMySells()
        {
            var userId = _userManager.GetUserId(User);  // Get user ID from the claims
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var sells = await _context.Sell
                .Where(s => s.UserAccountId == userId && s.SellStatus != SellStatus.Draft)
                .OrderByDescending(s => s.SellTime)
                .Select(s => new MySellDto
                {
                    SellId = s.SellId,
                    Message = s.Title,
                    SellImage = s.SellImages
                                    .OrderBy(si => si.Order)
                                    .FirstOrDefault().ImageUrl, // Ensure null-safety with ?
                    SellStatus = s.SellStatus,
                    SellTime = s.SellTime
                })
                .ToListAsync(); // Use ToListAsync for async query

            if (sells == null || !sells.Any())
            {
                return NotFound("No sells found for this user.");
            }
            return sells;
        }

        [HttpGet("RequestedSell")]
        public async Task<ActionResult<List<RequestedSellDto>>> GetRequestedSell()
        {
            var userId = _userManager.GetUserId(User);
            var requests = await _context.Request
                .Where(r => r.RequesterId == userId)
                .Select(r => new
                {
                    r.ResponderSellId,
                    r.ResponderSell.Title,
                    ImageUrl = r.ResponderSell.SellImages
                                    .OrderBy(si => si.Order)
                                    .Select(si => si.ImageUrl)
                                    .FirstOrDefault(),
                    r.Create,
                    r.Status
                })
                .ToListAsync();

            var prioritizedRequests = requests
                .GroupBy(r => r.ResponderSellId)
                .Select(g =>
                {
                    var prioritizedRequest = g.OrderBy(r => GetStatusPriority(r.Status)).First();
                    return new RequestedSellDto
                    {
                        SellId = prioritizedRequest.ResponderSellId,
                        Title = prioritizedRequest.Title,
                        ImageUrl = prioritizedRequest.ImageUrl,
                        Created = prioritizedRequest.Create,
                        Status = prioritizedRequest.Status
                    };
                })
                .ToList();

            return prioritizedRequests;
        }

        private int GetStatusPriority(RequestStatus status)
        {
            return status switch
            {
                RequestStatus.Approved => 1,
                RequestStatus.Withdrawn => 2,
                RequestStatus.Pending => 3,
                RequestStatus.Rejected => 4,
                _ => 5
            };
        }

        [HttpGet("RequestedSell/{sellId}")]
        public async Task<ActionResult<RequestedSellDetailDto>> GetRequestedSellDetail(int sellId)
        {
            var userId = _userManager.GetUserId(User);
            var requesterSells = await _context.Request
                .Where(r => r.ResponderSellId == sellId && r.RequesterId == userId && (r.RequesterSell.SellStatus == SellStatus.Recruiting || r.RequesterSell.SellStatus == SellStatus.Established))
                .Select(r => new RequestedSellDto { SellId = r.RequesterSellId, Title = r.RequesterSell.Title, Status = r.Status })
                .ToListAsync();

            if (requesterSells.Count == 0)
            {
                return NotFound();
            }

            var detailDto = new RequestedSellDetailDto
            {
                RequesterSells = requesterSells
            };

            return detailDto;
        }

        /*
        [HttpGet("Title")]
        public async Task<IActionResult> SearchManga([FromQuery] string query)
        {
            var katakanaQuery = JapaneseUtils.HiraganaToKatakana(query);

            var mangaTitles = await _context.MangaTitles
                .FromSqlRaw(@"
                SELECT main_title FROM manga_titles 
                WHERE main_title =% {0} OR yomi_title =% {0}
                ORDER BY count DESC
                LIMIT 30",
                katakanaQuery)
                .Select(m => m.MainTitle)
                .ToListAsync();

            var normalizedTitles = NormalizeTitles(mangaTitles);

            return Ok(normalizedTitles);
        }

        [HttpGet("Any")]
        public async Task<IActionResult> SearchMangaAndAuthor([FromQuery] string query)
        {
            var katakanaQuery = JapaneseUtils.HiraganaToKatakana(query);
            var mangaTitles = await _context.MangaTitles
                .FromSqlRaw(@"
            SELECT main_title FROM manga_titles 
            WHERE main_title =% {0} 
            OR yomi_title =% {0}
            OR author =% {0}
            ORDER BY count DESC
            LIMIT 30",
                katakanaQuery)
                .Select(m => m.MainTitle)
                .ToListAsync();
            var normalizedTitles = NormalizeTitles(mangaTitles);
            return Ok(normalizedTitles);
        }
        */
        [HttpGet("Title")]
        public async Task<IActionResult> SearchManga([FromQuery] string query)
        {
            var katakanaQuery = JapaneseUtils.HiraganaToKatakana(query);
            var mangaTitles = await _context.MangaTitles
                .FromSqlRaw(@"
                    SELECT main_title
                        FROM (
                            SELECT DISTINCT ON (main_title) main_title, count
                            FROM (
                                (SELECT main_title, count FROM manga_titles WHERE main_title =% {0} ORDER BY count DESC LIMIT 10)
                                UNION ALL
                                (SELECT main_title, count FROM manga_titles WHERE yomi_title =% {1} ORDER BY count DESC LIMIT 10)
                            ) AS combined
                            ORDER BY main_title, count DESC
                        ) AS distinct_titles
                        ORDER BY count DESC
                        LIMIT 20",
                query, katakanaQuery)
                .Select(m => m.MainTitle)
                .ToListAsync();
            var normalizedTitles = NormalizeTitles(mangaTitles);
            return Ok(normalizedTitles);
        }

        [HttpGet("Any")]
        public async Task<IActionResult> SearchMangaAndAuthor([FromQuery] string query)
        {
            var katakanaQuery = JapaneseUtils.HiraganaToKatakana(query);
            var mangaTitles = await _context.MangaTitles
                .FromSqlRaw(@"
                    SELECT main_title
                        FROM (
                            SELECT DISTINCT ON (main_title) main_title, count
                            FROM (
                                (SELECT main_title, count FROM manga_titles WHERE main_title =% {0})
                                UNION ALL
                                (SELECT main_title, count FROM manga_titles WHERE yomi_title =% {1})
                                UNION ALL
                                (SELECT main_title, count FROM manga_titles WHERE author =% {0})
                            ) AS combined
                            ORDER BY main_title, count DESC
                        ) AS distinct_titles
                        ORDER BY count DESC
                        LIMIT 20",
                query, katakanaQuery)
                .Select(m => m.MainTitle)
                .ToListAsync();
            var normalizedTitles = NormalizeTitles(mangaTitles);
            return Ok(normalizedTitles);
        }
        private static List<string> NormalizeTitles(List<string> titles)
        {
            var normalizedTitles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var title in titles)
            {
                var normalizedTitle = NormalizeTitle(title);
                normalizedTitles.Add(normalizedTitle);
            }

            return normalizedTitles.ToList();
        }

        private static string NormalizeTitle(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return title;

            // 特別な変換ルールの適用
            if (TitleNormalizationMap.TryGetValue(title, out var normalizedTitle))
            {
                return normalizedTitle;
            }

            // ☆と★を・に変換
            title = title.Replace('☆', '・').Replace('★', '・');

            // その他の正規化ルールをここに追加

            return title;
        }

        private bool SellExists(int id)
        {
            return _context.Sell.Any(e => e.SellId == id);
        }
    }
}
