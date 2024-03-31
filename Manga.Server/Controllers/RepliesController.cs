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
        public async Task<ActionResult<IEnumerable<ReplyDto>>> GetRepliesForSell(int sellId)
        {
            var userId = _userManager.GetUserId(User);
            var replies = await _context.Reply
                .Where(r => r.SellId == sellId)
                .OrderByDescending(r => r.Created)
                .Select(r => new ReplyDto
                {
                    ReplyId = r.ReplyId,
                    Message = r.Message,
                    Created = r.Created,
                    NickName = r.UserAccount.NickName, // UserAccountにニックネームのプロパティがあることを想定
                    ProfileIcon = r.UserAccount.ProfileIcon, // UserAccountにプロフィールアイコンのURLを保持するプロパティがあることを想定
                    IsCurrentUser = r.UserAccountId == userId
                })
                .ToListAsync();

            return Ok(replies);
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
            var userId = _userManager.GetUserId(User);
            
            //test out
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("ユーザーIDが取得できませんでした。");
            }
            

            var reply = new Reply
            {
                SellId = replyDto.SellId,
                Message = replyDto.Message,
                Created = DateTime.UtcNow,
                UserAccountId = userId
            };

            _context.Reply.Add(reply);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostReply), new { id = reply.ReplyId }, "Ok");
        }
        
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

        private bool ReplyExists(int id)
        {
            return _context.Reply.Any(e => e.ReplyId == id);
        }
    }
}
