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

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;


        public SellsController(ApplicationDbContext context, UserManager<UserAccount> userManager)
        {
            _context = context;
            _userManager = userManager;
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

            var sells = await _context.Sell.Include(s => s.SellImages).ToListAsync();
            var homeDtos = new List<HomeDto>();

            foreach (var sell in sells)
            {
                var wishTitles = await _context.WishList
                                               .Where(w => w.UserAccountId == sell.UserAccountId)
                                               .Select(w => new WishTitleInfo
                                               {
                                                   Title = w.Title,
                                                   // タイトルが現在のユーザーのOwnedListに含まれる場合、IsOwnedをtrueに設定
                                                   IsOwned = ownedTitles.Contains(w.Title)
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
                .FirstOrDefaultAsync(s => s.SellId == id);

            if (sell == null)
            {
                return NotFound();
            }

            // 出品者のWishListを取得
            var wishLists = await _context.WishList
                .Where(w => w.UserAccountId == sell.UserAccountId)
                .ToListAsync();

            // 現在のユーザーのMyListに含まれるタイトルのリストを取得
            var userMyListTitles = await _context.MyList
                .Where(m => m.UserAccountId == userId && m.SellId != null)
                .Select(m => m.Sell.Title)
                .ToListAsync();

            // WishListからWishTitleInfoリストを作成
            var wishTitles = wishLists
                .Select(wl => new WishTitleInfo
                {
                    Title = wl.Title,
                    IsOwned = userMyListTitles.Contains(wl.Title) // MyListに含まれていればtrue
                })
                .ToList();

            var dto = new SellDetailsDto
            {
                SellId = sell.SellId,
                Title = sell.Title,
                SendPrefecture = sell.SendPrefecture,
                SendDay = sell.SendDay,
                SellTime = sell.SellTime,
                BookState = sell.BookState,
                NumberOfBooks = sell.NumberOfBooks,
                SellMessage = sell.SellMessage,
                UserName = sell.UserAccount.UserName,
                ProfileIcon = sell.UserAccount.ProfileIcon,
                WishTitles = wishTitles
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

        private bool SellExists(int id)
        {
            return _context.Sell.Any(e => e.SellId == id);
        }
    }
}
