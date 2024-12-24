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
    public class RepliesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;

        public RepliesController(ApplicationDbContext context, UserManager<UserAccount> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Replies
        [HttpGet]
        
        public async Task<ActionResult<IEnumerable<Reply>>> GetReply()
        {
            return await _context.Reply.ToListAsync();
        }

        // GET: api/Replies/5
        /*
        [HttpGet("{id}")]
        public async Task<ActionResult<Reply>> GetReply(int id)
        {
            var reply = await _context.Reply.FindAsync(id);

            if (reply == null)
            {
                return NotFound();
            }

            return reply;
        }
        */
        [HttpGet("{id}")]
        public async Task<ActionResult<ReplyForSellDto>> GetRepliesForSell(int id)
        {
            var userId = _userManager.GetUserId(User);
            var sell = await _context.Sell.FirstOrDefaultAsync(s => s.SellId == id);

            if (sell == null)
            {
                return NotFound();
            }

            var replies = await _context.Reply
                .Where(r => r.SellId == id)
                .OrderBy(r => r.Created)
                .Select(r => new ReplyDto
                {
                    ReplyId = r.ReplyId,
                    Message = r.IsDeleted ? null : r.Message, // 削除された返信の場合は特定のメッセージを表示
                    Created = r.Created,
                    UserAccount = r.IsDeleted ? null : r.UserAccountId,
                    NickName = r.IsDeleted ? null : r.UserAccount.NickName, // 削除された返信の場合はニックネームを隠す
                    ProfileIcon = r.IsDeleted ? null : r.UserAccount.ProfileIcon, // 削除された返信の場合はプロフィールアイコンを隠す
                    IsDeleted = r.IsDeleted,
                })
                .ToListAsync();

            var response = new ReplyForSellDto
            {
                Replies = replies,
                IsCurrentUserSeller = sell.UserAccountId == userId // 現在のユーザーが出品者かどうかをチェック
            };

            return response;
        }


        // PUT: api/Replies/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReply(int id, Reply reply)
        {
            if (id != reply.ReplyId)
            {
                return BadRequest();
            }

            _context.Entry(reply).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReplyExists(id))
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

        // POST: api/Replies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*
        [HttpPost]
        public async Task<ActionResult<Reply>> PostReply(Reply reply)
        {
            _context.Reply.Add(reply);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReply", new { id = reply.ReplyId }, reply);
        }
        */
        
        [HttpPost]
        public async Task<ActionResult<Reply>> PostReply(ReplyPostDto replyDto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var reply = new Reply
            {
                SellId = replyDto.SellId,
                Message = replyDto.Message,
                Created = DateTime.UtcNow,
                UserAccountId = user.Id,
                IsDeleted = false,
            };

            _context.Reply.Add(reply);
            await _context.SaveChangesAsync();

            await NotificationsController.CreateNotificationsAsync(_context, replyDto.SellId, user.Id, user.NickName);

            return CreatedAtAction(nameof(PostReply), new { id = reply.ReplyId }, "Ok");
        }



        [HttpPut("DeleteReply/{replyId}")]
        public async Task<IActionResult> DeleteReply(int replyId)
        {
            var userId = _userManager.GetUserId(User);
            var reply = await _context.Reply
                .Include(r => r.Sell)
                .FirstOrDefaultAsync(r => r.ReplyId == replyId);

            if (reply == null || reply.Sell == null)
            {
                return NotFound("該当するコメントまたは出品が見つかりません。");
            }

            if (reply.Sell.UserAccountId != userId)
            {
                return new ObjectResult("出品者以外はコメントを削除することはできません。")
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
            }

            reply.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /*
        // DELETE: api/Replies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReply(int id)
        {
            var reply = await _context.Reply.FindAsync(id);
            if (reply == null)
            {
                return NotFound();
            }

            _context.Reply.Remove(reply);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        */
        private bool ReplyExists(int id)
        {
            return _context.Reply.Any(e => e.ReplyId == id);
        }
    }
}
