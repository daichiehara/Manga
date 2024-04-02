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
                .OrderByDescending(r => r.Created)
                .Select(r => new ReplyDto
                {
                    ReplyId = r.ReplyId,
                    Message = r.IsDeleted ? null : r.Message, // 削除された返信の場合は特定のメッセージを表示
                    Created = r.Created,
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
                UserAccountId = userId,
                IsDeleted = false,
            };

            _context.Reply.Add(reply);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostReply), new { id = reply.ReplyId }, "Ok");
        }

        [HttpPost("DeleteReply/{replyId}")]
        public async Task<IActionResult> DeleteReply(int replyId)
        {
            var userId = _userManager.GetUserId(User); // 現在のユーザーIDを取得

            // 指定されたIDを持つ返信とその関連する出品をデータベースから検索
            var reply = await _context.Reply
                .Include(r => r.Sell) // Sell情報も一緒に取得
                .FirstOrDefaultAsync(r => r.ReplyId == replyId);

            // 返信が見つからない、または返信に関連する出品が見つからない場合は、NotFoundを返す
            if (reply == null || reply.Sell == null)
            {
                return NotFound("該当するコメントまたは出品が見つかりません。");
            }

            // 現在のユーザーが返信に関連する出品の出品者でない場合は、権限エラーを返す
            if (reply.Sell.UserAccountId != userId)
            {
                return new ObjectResult("出品者以外はコメントを削除することはできません。") { StatusCode = StatusCodes.Status403Forbidden };// または適切なエラーメッセージと共に BadRequest を返す
            }

            // 返信が見つかり、現在のユーザーが出品者である場合は、IsDeletedをtrueに設定
            reply.IsDeleted = true;

            // データベースの変更を保存
            await _context.SaveChangesAsync();

            // 成功のレスポンスを返す（ここでは204 No Contentを返しています）
            return Ok();
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
