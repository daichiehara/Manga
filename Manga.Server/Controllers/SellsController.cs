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


        private bool SellExists(int id)
        {
            return _context.Sell.Any(e => e.SellId == id);
        }
    }
}
