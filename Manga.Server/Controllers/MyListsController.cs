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
    public class MyListsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;

        public MyListsController(ApplicationDbContext context, UserManager<UserAccount> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/MyLists
        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MyList>>> GetMyList()
        {
            return await _context.MyList.ToListAsync();
        }
        */
        [HttpGet]
        public async Task<ActionResult<List<HomeDto>>> GetMyListDataAsync()
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // 現在のユーザーのOwnedListのタイトルを取得
            var ownedTitles = await _context.OwnedList
                .Where(o => o.UserAccountId == userId)
                .Select(o => o.Title)
                .ToListAsync();

            // MyListに登録したSellのIDを取得
            var myListSellIds = await _context.MyList
                .Where(m => m.UserAccountId == userId)
                .Select(m => m.SellId)
                .ToListAsync();

            // myListSellIdsに含まれるSellIdに対応するSellの情報を取得
            var myListSells = await _context.Sell
                .Where(s => myListSellIds.Contains(s.SellId))
                .Include(s => s.SellImages)
                .ToListAsync();

            var homeDtos = new List<HomeDto>();

            foreach (var sell in myListSells)
            {
                // 出品者のWishListのタイトルを取得
                var wishTitles = await _context.WishList
                    .Where(w => w.UserAccountId == sell.UserAccountId)
                    .Select(w => w.Title)
                    .ToListAsync();

                // WishListのタイトルと現在のユーザーのOwnedListのタイトルとのマッチングを行う
                var wishTitleInfos = wishTitles.Select(title => new WishTitleInfo
                {
                    Title = title,
                    IsOwned = ownedTitles.Contains(title) // 現在のユーザーが持っているかどうか
                }).ToList();

                var dto = new HomeDto
                {
                    SellId = sell.SellId,
                    SellTitle = sell.Title,
                    SellImage = sell.SellImages.OrderBy(si => si.Order).FirstOrDefault()?.ImageUrl,
                    WishTitles = wishTitleInfos // マッチング結果を含める
                };

                homeDtos.Add(dto);
            }

            return Ok(homeDtos);
        }

        // GET: api/MyLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MyList>> GetMyList(int id)
        {
            var myList = await _context.MyList.FindAsync(id);

            if (myList == null)
            {
                return NotFound();
            }

            return myList;
        }

        // PUT: api/MyLists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMyList(int id, MyList myList)
        {
            if (id != myList.MyListId)
            {
                return BadRequest();
            }

            _context.Entry(myList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MyListExists(id))
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

        // POST: api/MyLists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*
        [HttpPost]
        public async Task<ActionResult<MyList>> PostMyList(MyList myList)
        {
            _context.MyList.Add(myList);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMyList", new { id = myList.MyListId }, myList);
        }
        */

        [HttpPost]
        public async Task<ActionResult<MyList>> AddToMyList(int sellId)
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // すでに同じSellがMyListに登録されているかチェック
            var existingItem = await _context.MyList
                .Where(m => m.UserAccountId == userId && m.SellId == sellId)
                .FirstOrDefaultAsync();
            if (existingItem != null)
            {
                // 既に存在する場合は、何もせずにOKを返す（またはエラーメッセージを返す）
                return Ok();
            }

            // 新しいMyListエントリを作成
            var myList = new MyList
            {
                UserAccountId = userId,
                SellId = sellId
            };

            _context.MyList.Add(myList);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/MyLists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMyList(int id)
        {
            var myList = await _context.MyList.FindAsync(id);
            if (myList == null)
            {
                return NotFound();
            }

            _context.MyList.Remove(myList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MyListExists(int id)
        {
            return _context.MyList.Any(e => e.MyListId == id);
        }
    }
}
