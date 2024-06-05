using System;
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
                    .ToList(),
                SellImage = sell.SellImages.OrderBy(si => si.Order).FirstOrDefault()?.ImageUrl
            }).ToList();

            return homeDtos;
        }

        [HttpGet("MyFavorite")]
        public async Task<ActionResult<List<HomeDto>>> GetMyListSellsAsync()
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return NotFound();
            }

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

            // 現在のユーザーのWishListのタイトルリストを取得
            var wishTitles = await _context.WishList
                .Where(w => w.UserAccountId == userId)
                .Select(w => w.Title)
                .ToListAsync();

            // 自分のOwnedListのタイトルまたはSellのタイトルと、WishListのタイトルが一致するユーザーのSellを取得
            var matchingUserSells = await _context.Sell
                .Include(s => s.SellImages)
                .Where(s => _context.WishList.Any(w => w.UserAccountId == s.UserAccountId && userTitles.Contains(w.Title)) && (s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established))
                .ToListAsync();

            // 自分のWishListと同じタイトルのSellを取得
            var wishMatchingSells = await _context.Sell
                .Include(s => s.SellImages)
                .Where(s => wishTitles.Contains(s.Title) && (s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established))
                .ToListAsync();

            // すべてのSellを新着順に取得
            var allSells = await _context.Sell
                .Include(s => s.SellImages)
                .Where(s => s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established)
                .OrderByDescending(s => s.SellTime)
                .ToListAsync();

            // 自分のOwnedListまたはSellのタイトルと、WishListのタイトルが一致するユーザーのSellの中で、自分のWishListと同じタイトルのSellを抽出
            var exactMatchingSells = matchingUserSells
                .Where(s => wishTitles.Contains(s.Title))
                .ToList();

            // 結果のリストを作成
            var recommendedSells = exactMatchingSells
                .Concat(matchingUserSells)
                .Concat(wishMatchingSells)
                .Concat(allSells)
                .Distinct()
                .Where(r => r.UserAccountId != userId)
                .ToList();

            var homeDtos = new List<HomeDto>();

            foreach (var sell in recommendedSells)
            {
                var wishTitle = await _context.WishList
                    .Where(w => w.UserAccountId == sell.UserAccountId)
                    .Select(w => new WishTitleInfo
                    {
                        Title = w.Title,
                        IsOwned = userTitles.Contains(w.Title)
                    })
                    .ToListAsync();

                var dto = new HomeDto
                {
                    SellId = sell.SellId,
                    SellTitle = sell.Title,
                    NumberOfBooks = sell.NumberOfBooks,
                    WishTitles = wishTitle,
                    SellImage = sell.SellImages
                        .OrderBy(si => si.Order)
                        .FirstOrDefault()?.ImageUrl
                };

                homeDtos.Add(dto);
            }

            return homeDtos;
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
                .FirstOrDefaultAsync(s => s.SellId == id);

            if (sell == null)
            {
                return NotFound();
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
                        SellId = sell.SellId
                    });
                }
            }

            sell.SellImages = sellImages;

            _context.Sell.Add(sell);
            await _context.SaveChangesAsync();

            if (sellCreateDto.SellStatus == SellStatus.Recruiting)
            {
                return CreatedAtAction(nameof(GetSellDetails), new { id = sell.SellId }, sell);
            }
            else
            {
                return Ok(sell);
            }
        }

        [HttpGet("Drafts")]
        public async Task<ActionResult<IEnumerable<SellDraftDto>>> GetDrafts()
        {
            // 現在のユーザーIDを取得
            var userId = _userManager.GetUserId(User);

            // 自分の下書きのみをフィルタリング
            var drafts = await _context.Sell
                .Where(s => s.SellStatus == SellStatus.Draft && s.UserAccountId == userId)
                .Select(s => new SellDraftDto
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
                .Where(s => s.SellId == Id && s.UserAccountId == userId && s.SellStatus == SellStatus.Draft)
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
                SellImages = sell.SellImages.Select(si => new SellImageCreateDto
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

            // 既存の画像を取得
            var existingImages = sell.SellImages.ToDictionary(si => si.ImageUrl);

            // 削除対象の画像URLを取得
            var imagesToDelete = existingImages.Keys.Except(sellUpdateDto.SellImages.Select(si => si.ImageUrl)).ToList();

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

            foreach (var imageDto in sellUpdateDto.SellImages)
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

            return NoContent();
        }

        // DELETE: api/Sells/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSell(int id)
        {
            var sell = await _context.Sell.FindAsync(id);
            if (sell == null)
            {
                return NotFound();
            }

            _context.Sell.Remove(sell);
            await _context.SaveChangesAsync();

            return NoContent();
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
                var dpid = "iss-ndl-opac";
                var mediatipe = "booklet";
                var apiUrl = $"https://ndlsearch.ndl.go.jp/api/opensearch?dpid={dpid}&any={title}&ndc={encodedNdc}&cnt=270";


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
                .Where(s => s.UserAccountId == userId)
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

        private string NormalizeTitle(string title)
        {
            return title.Replace("★", "・").Replace("☆", "・");
        }

        private bool SellExists(int id)
        {
            return _context.Sell.Any(e => e.SellId == id);
        }
    }
}
