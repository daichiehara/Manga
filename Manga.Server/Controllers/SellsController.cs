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
using Microsoft.EntityFrameworkCore.Infrastructure;
using Npgsql;
using Amazon.Runtime.Internal.Transform;

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
            { "Dragon Ball", "ドラゴンボール" }
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
        public async Task<ActionResult<List<HomeDto>>> GetHomeDataAsync(int page = 1, int pageSize = 10)
        {
            var userId = _userManager.GetUserId(User);

            if (string.IsNullOrEmpty(userId))
            {
                // ログインしていないユーザーの場合、新着順で返す
                return await GetLatestSellsAsync(page, pageSize);
            }

            var userSellAndOwnedTitles = await (from u in _context.Users
                                             where u.Id == userId
                                             select new
                                             {
                                                 OwnedTitles = u.OwnedLists.Select(o => o.Title),
                                                 SellTitles = u.Sells.Select(s => s.Title),
                                             }).FirstOrDefaultAsync();

            var userTitles = userSellAndOwnedTitles.OwnedTitles.Union(userSellAndOwnedTitles.SellTitles).ToHashSet();

            var query = _context.Sell
                .Include(s => s.SellImages)
                .Include(s => s.UserAccount.WishLists)
                .Where(s => s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established)
                .OrderByDescending(s => s.SellTime)
                .Select(s => new HomeDto
                {
                    SellId = s.SellId,
                    SellTitle = s.Title,
                    NumberOfBooks = s.NumberOfBooks,
                    SellStatus = s.SellStatus,
                    WishTitles = s.UserAccount.WishLists
                        .Select(w => new WishTitleInfo
                        {
                            Title = w.Title,
                            IsOwned = userTitles.Contains(w.Title)
                        })
                        .OrderByDescending(w => userTitles.Contains(w.Title))
                        .ToList(),
                    SellImage = s.SellImages
                        .OrderBy(si => si.Order)
                        .FirstOrDefault().ImageUrl
                });

            var totalItems = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return items;
        }

        [HttpGet("SearchByWord")]
        public async Task<ActionResult<List<HomeDto>>> SearchSellsAsync(
            [FromQuery] string search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool onlyRecruiting = false)
        {
            if (string.IsNullOrWhiteSpace(search))
            {
                return BadRequest("検索語が指定されていません。");
            }

            var userId = _userManager.GetUserId(User);
            var katakanaSearchTerm = JapaneseUtils.HiraganaToKatakana(search.ToLowerInvariant());

            var userTitlesQuery = _context.OwnedList
                .Where(o => o.UserAccountId == userId)
                .Select(o => o.Title)
                .Union(_context.Sell
                    .Where(s => s.UserAccountId == userId)
                    .Select(s => s.Title));

            var query = _context.Sell
                .Include(s => s.SellImages)
                .Include(s => s.UserAccount.WishLists)
                .Where(s => (onlyRecruiting ? s.SellStatus == SellStatus.Recruiting :
                    (s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established)) &&
                    EF.Functions.ILike(s.UnifiedSearchText, $"%{katakanaSearchTerm}%"))
                .OrderByDescending(s => s.SellTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new
                {
                    Sell = s,
                    WishLists = s.UserAccount.WishLists.Select(w => new { w.Title }).ToList(),
                    SellImage = s.SellImages.OrderBy(si => si.Order).FirstOrDefault().ImageUrl
                });

            var results = await query.ToListAsync();
            var userTitles = await userTitlesQuery.ToListAsync();

            var homeDtos = results.Select(r => new HomeDto
            {
                SellId = r.Sell.SellId,
                SellTitle = r.Sell.Title,
                NumberOfBooks = r.Sell.NumberOfBooks,
                SellStatus = r.Sell.SellStatus,
                WishTitles = r.WishLists.Select(w => new WishTitleInfo
                {
                    Title = w.Title,
                    IsOwned = userTitles.Contains(w.Title)
                }).OrderByDescending(w => w.IsOwned).ToList(),
                SellImage = r.SellImage
            }).ToList();

            return homeDtos;
        }

        [HttpGet("SearchByTitleForExchange")]
        public async Task<ActionResult<List<HomeDto>>> SearchSellsByTitleForExchangeAsync(
            [FromQuery] string search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool onlyRecruiting = false)
        {
            var userId = _userManager.GetUserId(User);

            var userTitles = await _context.OwnedList
                .Where(o => o.UserAccountId == userId)
                .Select(o => o.Title)
                .Union(_context.Sell
                    .Where(s => s.UserAccountId == userId)
                    .Select(s => s.Title))
                .ToListAsync();

            var query = from sell in _context.Sell
                        join wishList in _context.WishList on sell.UserAccountId equals wishList.UserAccountId
                        where wishList.Title == search
                            && (onlyRecruiting ? sell.SellStatus == SellStatus.Recruiting :
                            (sell.SellStatus == SellStatus.Recruiting || sell.SellStatus == SellStatus.Established))
                        select new
                        {
                            Sell = sell,
                            WishLists = sell.UserAccount.WishLists,
                            SellImage = sell.SellImages.OrderBy(si => si.Order).FirstOrDefault().ImageUrl,
                            OwnedCount = sell.UserAccount.WishLists.Count(w => userTitles.Contains(w.Title))
                        };

            var results = await query
                .OrderByDescending(x => x.OwnedCount)
                .ThenByDescending(x => x.Sell.SellTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var homeDtos = results.Select(r => new HomeDto
            {
                SellId = r.Sell.SellId,
                SellTitle = r.Sell.Title,
                NumberOfBooks = r.Sell.NumberOfBooks,
                SellStatus = r.Sell.SellStatus,
                WishTitles = r.WishLists
                .Select(w => new WishTitleInfo
                {
                    Title = w.Title,
                    IsOwned = userTitles.Contains(w.Title)
                })
                .OrderByDescending(w => w.Title == search)  // 検索クエリと一致するものを最初に
                .ThenByDescending(w => w.IsOwned)           // 次に所有しているものを優先
                .ToList(),
                        SellImage = r.SellImage,
            }).ToList();

            return homeDtos;
        }

        [HttpGet("MyFavorite")]
        public async Task<ActionResult<List<HomeDto>>> GetMyListSellsAsync(int page = 1, int pageSize = 10)
        {
            var userId = _userManager.GetUserId(User);

            if (string.IsNullOrEmpty(userId))
            {
                return new List<HomeDto>();
            }

            var query = _context.MyList
                .Where(m => m.UserAccountId == userId)
                .Select(m => m.Sell)
                .Where(s => s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established)
                .OrderByDescending(s => s.SellTime)
                .Select(s => new HomeDto
                {
                    SellId = s.SellId,
                    SellTitle = s.Title,
                    NumberOfBooks = s.NumberOfBooks,
                    SellStatus = s.SellStatus,
                    WishTitles = s.UserAccount.WishLists
                        .Select(w => new WishTitleInfo
                        {
                            Title = w.Title,
                            IsOwned = s.UserAccount.OwnedLists.Any(o => o.Title == w.Title) ||
                                      s.UserAccount.Sells.Any(sell => sell.Title == w.Title)
                        })
                        .OrderByDescending(w => w.IsOwned)
                        .ToList(),
                    SellImage = s.SellImages
                        .OrderBy(si => si.Order)
                        .FirstOrDefault().ImageUrl
                });

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return items;
        }

        [HttpGet("Recommend")]
        public async Task<ActionResult<List<HomeDto>>> GetRecommendedSellsAsync(int page = 1, int pageSize = 10)
        {
            var userId = _userManager.GetUserId(User);

            if (string.IsNullOrEmpty(userId))
            {
                // ログインしていないユーザーの場合、新着順で返す
                return await GetLatestSellsAsync(page, pageSize);
            }

            // 1. ユーザーの所有タイトルとWishリストを一度のクエリで取得
            var userTitlesAndWishes = await (from u in _context.Users
                                             where u.Id == userId
                                             select new
                                             {
                                                 OwnedTitles = u.OwnedLists.Select(o => o.Title),
                                                 SellTitles = u.Sells.Select(s => s.Title),
                                                 WishTitles = u.WishLists.Select(w => w.Title)
                                             }).FirstOrDefaultAsync();

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
                    SellStatus = s.SellStatus,
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
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return recommendedSells;
        }

        private async Task<ActionResult<List<HomeDto>>> GetLatestSellsAsync(int page = 1, int pageSize = 10)
        {
            var latestSells = await _context.Sell
                .Include(s => s.SellImages)
                .Include(s => s.UserAccount.WishLists)  // WishListsを含める
                .Where(s => s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established)
                .OrderByDescending(s => s.SellTime)
                .Select(s => new HomeDto
                {
                    SellId = s.SellId,
                    SellTitle = s.Title,
                    NumberOfBooks = s.NumberOfBooks,
                    SellStatus = s.SellStatus,
                    WishTitles = s.UserAccount.WishLists
                        .Select(w => new WishTitleInfo
                        {
                            Title = w.Title,
                            IsOwned = false
                        })
                        .ToList(),
                    SellImage = s.SellImages
                        .OrderBy(si => si.Order)
                        .FirstOrDefault().ImageUrl
                })
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return latestSells;
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
            var userId = _userManager.GetUserId(User);

            // メインのクエリを実行
            var sellQuery = await _context.Sell
                .Include(s => s.UserAccount)
                .Include(s => s.SellImages)
                .Include(s => s.MyLists)
                .Where(s => s.SellId == id)
                .Select(s => new
                {
                    Sell = s,
                    IsPublic = s.SellStatus == SellStatus.Recruiting || s.SellStatus == SellStatus.Established,
                    IsOwner = s.UserAccountId == userId,
                    LikeCount = s.MyLists.Count,
                    IsLiked = s.MyLists.Any(ml => ml.UserAccountId == userId)
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (sellQuery == null || (!sellQuery.IsPublic && !sellQuery.IsOwner))
            {
                return NotFound();
            }

            var sell = sellQuery.Sell;

            // 残りのデータを順次取得
            var requestStatus = await GetRequestStatus(userId, id, sell.SellStatus, sell.UserAccountId);
            var wishTitles = await GetWishTitles(userId, sell.UserAccountId);
            var replies = await GetReplies(id);
            var replyCount = await GetReplyCount(id);

            var dto = new SellDetailsDto
            {
                // DTOプロパティの設定（変更なし）
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
                IsLiked = sellQuery.IsLiked,
                LikeCount = sellQuery.LikeCount,
                RequestButtonStatus = requestStatus
            };

            return dto;
        }

        private async Task<RequestButtonStatus> GetRequestStatus(string userId, int sellId, SellStatus sellStatus, string sellUserAccountId)
        {

            var userRequest = await _context.Request
                .Where(r => r.RequesterId == userId && r.ResponderSellId == sellId)
                .Select(r => r.Status)
                .FirstOrDefaultAsync();

            if (sellStatus == SellStatus.Established)
            {
                return RequestButtonStatus.Matched;
            }
            else if (sellUserAccountId == userId)
            {
                return RequestButtonStatus.OwnSell;
            }
            else if (userRequest == RequestStatus.Withdrawn)
            {
                return RequestButtonStatus.AlreadyRequested;
            }
            else
            {
                return RequestButtonStatus.CanRequest;
            }
        }

        private async Task<List<WishTitleInfo>> GetWishTitles(string userId, string sellUserAccountId)
        {
            var wishList = await _context.WishList
                .Where(w => w.UserAccountId == sellUserAccountId)
                .AsNoTracking()
                .ToListAsync();

            var userTitles = await _context.OwnedList
                .Where(m => m.UserAccountId == userId)
                .Select(m => m.Title)
                .Union(_context.Sell.Where(s => s.UserAccountId == userId).Select(s => s.Title))
                .AsNoTracking()
                .ToListAsync();

            return wishList
                .Select(wl => new WishTitleInfo
                {
                    Title = wl.Title,
                    IsOwned = userTitles.Contains(wl.Title)
                })
                .OrderByDescending(w => w.IsOwned)
                .ToList();
        }

        private async Task<List<ReplyDto>> GetReplies(int sellId)
        {
            return await _context.Reply
                .Where(r => r.SellId == sellId)
                .OrderByDescending(r => r.Created)
                .Take(3)
                .Select(r => new ReplyDto
                {
                    ReplyId = r.ReplyId,
                    NickName = r.UserAccount.NickName,
                    ProfileIcon = r.UserAccount.ProfileIcon,
                    Message = r.Message,
                    Created = r.Created,
                })
                .AsNoTracking()
                .ToListAsync();
        }

        private async Task<int> GetReplyCount(int sellId)
        {
            return await _context.Reply.CountAsync(r => r.SellId == sellId);
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
                            (SELECT main_title, count FROM manga_titles WHERE author ILIKE {2} ORDER BY count DESC LIMIT 5)
                        ) AS combined
                        ORDER BY main_title, count DESC
                    ) AS distinct_titles
                    ORDER BY count DESC
                    LIMIT 20",
                query, katakanaQuery, $"%{query}%")
                .Select(m => m.MainTitle)
                .ToListAsync();

            var normalizedTitles = NormalizeTitles(mangaTitles);
            return Ok(normalizedTitles);
        }

        [HttpGet("All")]
        public async Task<IActionResult> SearchAllMangaAndAuthor([FromQuery] string query)
        {
            var katakanaQuery = JapaneseUtils.HiraganaToKatakana(query);
            var searchResults = new List<Tuple<string, bool>>();  // 変更: bool を追加して著者の完全一致を示す
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @"
                SELECT result, is_exact_author_match
                FROM (
                    SELECT DISTINCT ON (result) result, count, 
                           CASE WHEN author_match THEN TRUE ELSE FALSE END as is_exact_author_match
                    FROM (
                        (SELECT author AS result, count, TRUE as author_match FROM manga_titles WHERE author ILIKE @p0 LIMIT 1)
                        UNION ALL
                        (SELECT main_title AS result, count, FALSE as author_match FROM manga_titles WHERE main_title =% @p1)
                        UNION ALL
                        (SELECT main_title AS result, count, FALSE as author_match FROM manga_titles WHERE yomi_title =% @p2)
                        UNION ALL
                        (SELECT main_title AS result, count, FALSE as author_match FROM manga_titles WHERE author ILIKE @p0 ORDER BY count DESC LIMIT 5)
                    ) AS combined
                    ORDER BY result, count DESC
                ) AS distinct_results
                ORDER BY is_exact_author_match DESC, count DESC
                LIMIT 20";
                command.Parameters.Add(new NpgsqlParameter("p0", $"%{query}%"));
                command.Parameters.Add(new NpgsqlParameter("p1", query));
                command.Parameters.Add(new NpgsqlParameter("p2", katakanaQuery));
                await _context.Database.OpenConnectionAsync();
                using (var result = await command.ExecuteReaderAsync())
                {
                    while (await result.ReadAsync())
                    {
                        searchResults.Add(new Tuple<string, bool>(result.GetString(0), result.GetBoolean(1)));
                    }
                }
            }
            var normalizedResults = NormalizeResults(searchResults, query);
            return Ok(normalizedResults);
        }

        private List<string> NormalizeResults(List<Tuple<string, bool>> results, string query)
        {
            var normalizedResults = new List<(string Name, int Priority, bool IsExactAuthorMatch)>();
            var seenResults = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            IEnumerable<string> ExtractNames(string input)
            {
                input = System.Text.RegularExpressions.Regex.Replace(input, @"\[.*?\]", "");
                var parts = input.Split(',').Select(p => p.Trim());
                return parts.Where(p => !string.IsNullOrEmpty(p));
            }

            foreach (var result in results)
            {
                var names = ExtractNames(result.Item1);
                foreach (var name in names)
                {
                    var normalizedName = NormalizeTitle(name);
                    if (!seenResults.Contains(normalizedName))
                    {
                        int priority = 0;
                        if (normalizedName.Equals(query, StringComparison.OrdinalIgnoreCase))
                            priority = 3;
                        else if (normalizedName.StartsWith(query, StringComparison.OrdinalIgnoreCase))
                            priority = 2;
                        else if (normalizedName.Contains(query, StringComparison.OrdinalIgnoreCase))
                            priority = 1;

                        normalizedResults.Add((normalizedName, priority, result.Item2));
                        seenResults.Add(normalizedName);
                    }
                }
            }

            return normalizedResults
                .OrderByDescending(x => x.Priority)
                .ThenByDescending(x => x.IsExactAuthorMatch)
                .Select(x => x.Name)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
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
