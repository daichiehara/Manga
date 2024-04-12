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

        public SellsController(ApplicationDbContext context, UserManager<UserAccount> userManager, IHttpClientFactory httpClientFactory, ILogger<SellsController> logger)
        {
            _context = context;
            _userManager = userManager;
            _httpClient = httpClientFactory.CreateClient();
            _logger = logger;
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
        [Authorize]
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
                .Where(s => wishMatchingUserIds.Contains(s.UserAccountId))
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
                .Where(s => wishMatchingUserIds.Contains(s.UserAccountId))
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
        [Authorize]
        public async Task<ActionResult<List<HomeDto>>> GetMyListSellsAsync()
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("ユーザー認証に失敗しました。");
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
                .Where(s => myListSellIds.Contains(s.SellId))
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

        // POST: api/Sells
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Sell>> PostSell(Sell sell)
        {
            _context.Sell.Add(sell);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSell", new { id = sell.SellId }, sell);
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
                var apiUrl = $"https://ndlsearch.ndl.go.jp/api/opensearch?dpid={dpid}&title={title}&any={title}&ndc={encodedNdc}&cnt=500";


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
