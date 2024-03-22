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
    public class OwnedListsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;

        public OwnedListsController(ApplicationDbContext context, UserManager<UserAccount> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/OwnedLists
        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OwnedList>>> GetOwnedList()
        {
            return await _context.OwnedList.ToListAsync();
        }
        */
        [HttpGet]
        public async Task<ActionResult<OwnedListDto>> GetUserLists()
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var ownedLists = await _context.OwnedList
                                           .Where(o => o.UserAccountId == userId)
                                           .Select(o => new ItemDto { ItemId = o.OwnedListId, Title = o.Title })
                                           .ToListAsync();

            var sells = await _context.Sell
                                      .Where(s => s.UserAccountId == userId)
                                      .Select(s => new ItemDto { ItemId = s.SellId, Title = s.Title })
                                      .ToListAsync();

            var dto = new OwnedListDto
            {
                OwnedLists = ownedLists,
                Sells = sells
            };

            return Ok(dto);
        }
        // GET: api/OwnedLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OwnedList>> GetOwnedList(int id)
        {
            var ownedList = await _context.OwnedList.FindAsync(id);

            if (ownedList == null)
            {
                return NotFound();
            }

            return ownedList;
        }

        // PUT: api/OwnedLists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOwnedList(int id, OwnedList ownedList)
        {
            if (id != ownedList.OwnedListId)
            {
                return BadRequest();
            }

            _context.Entry(ownedList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OwnedListExists(id))
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

        // POST: api/OwnedLists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OwnedList>> PostOwnedList(OwnedList ownedList)
        {
            _context.OwnedList.Add(ownedList);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOwnedList", new { id = ownedList.OwnedListId }, ownedList);
        }

        // DELETE: api/OwnedLists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOwnedList(int id)
        {
            var ownedList = await _context.OwnedList.FindAsync(id);
            if (ownedList == null)
            {
                return NotFound();
            }

            _context.OwnedList.Remove(ownedList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OwnedListExists(int id)
            {
                return _context.OwnedList.Any(e => e.OwnedListId == id);
            }
    }
}
