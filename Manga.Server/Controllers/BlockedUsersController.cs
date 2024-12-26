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
using Microsoft.AspNetCore.Authorization;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlockedUsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;

        public BlockedUsersController(ApplicationDbContext context, UserManager<UserAccount> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("{userId}")]
        [Authorize]
        public async Task<IActionResult> BlockUser(string userId)
        {
            var currentUserId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized();
            }

            if (currentUserId == userId)
            {
                return BadRequest("自分自身をブロックすることはできません。");
            }

            var blockedUser = new BlockedUser
            {
                BlockerId = currentUserId,
                BlockedId = userId,
                Created = DateTime.UtcNow
            };

            _context.BlockedUser.Add(blockedUser);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{userId}")]
        [Authorize]
        public async Task<IActionResult> UnblockUser(string userId)
        {
            var currentUserId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized();
            }

            var blockRecord = await _context.BlockedUser
                .FirstOrDefaultAsync(b => b.BlockerId == currentUserId && b.BlockedId == userId);

            if (blockRecord != null)
            {
                _context.BlockedUser.Remove(blockRecord);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }

        private bool BlockedUserExists(int id)
        {
            return _context.BlockedUser.Any(e => e.Id == id);
        }
    }
}
