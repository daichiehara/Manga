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
    public class WishListsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;

        public WishListsController(ApplicationDbContext context, UserManager<UserAccount> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/WishLists
        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WishList>>> GetWishList()
        {
            return await _context.WishList.ToListAsync();
        }
        */
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetWishLists()
        {
            // 認証されたユーザーのIDを取得する
            var userId = _userManager.GetUserId(User); // UserManagerを使用してユーザーIDを取得
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var wishLists = await _context.WishList
                .Where(w => w.UserAccountId == userId) // 特定のユーザーに紐付けられたWishListのみをフィルタリング
                .Select(w => new ItemDto
                {
                    ItemId = w.WishListId,
                    Title = w.Title
                })
                .ToListAsync();

            return Ok(wishLists);
        }
        // GET: api/WishLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WishList>> GetWishList(int id)
        {
            var wishList = await _context.WishList.FindAsync(id);

            if (wishList == null)
            {
                return NotFound();
            }

            return wishList;
        }

        // PUT: api/WishLists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWishList(int id, WishList wishList)
        {
            if (id != wishList.WishListId)
            {
                return BadRequest();
            }

            _context.Entry(wishList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WishListExists(id))
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

        // POST: api/WishLists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*
        [HttpPost]
        public async Task<ActionResult<WishList>> PostWishList(WishList wishList)
        {
            _context.WishList.Add(wishList);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWishList", new { id = wishList.WishListId }, wishList);
        }
        */

        [HttpPost]
        public async Task<IActionResult> AddToWishList([FromBody] List<string> titles)
        {
            if (titles == null || titles.Count == 0)
            {
                return BadRequest("タイトルは必須です。");
            }
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return NotFound("ユーザー認証に失敗しました。");
            }
            var addedTitles = new List<string>();
            foreach (var title in titles)
            {
                // すでに同じタイトルがWishListに存在するか確認
                var existingEntry = await _context.WishList
                                                  .FirstOrDefaultAsync(w => w.UserAccountId == userId && w.Title == title);
                if (existingEntry == null)
                {
                    // ユーザーIDとタイトルを使用して新しいWishListエントリーを作成
                    var wishListEntry = new WishList
                    {
                        Title = title,
                        UserAccountId = userId
                    };
                    // データベースにエントリーを追加
                    _context.WishList.Add(wishListEntry);
                    addedTitles.Add(title);
                }
            }
            await _context.SaveChangesAsync();
            return Ok($"タイトル '{string.Join(", ", addedTitles)}' がWishListに追加されました。");
        }

        // DELETE: api/WishLists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWishList(int id)
        {
            var wishList = await _context.WishList.FindAsync(id);
            if (wishList == null)
            {
                return NotFound();
            }

            _context.WishList.Remove(wishList);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool WishListExists(int id)
        {
            return _context.WishList.Any(e => e.WishListId == id);
        }
    }
}
