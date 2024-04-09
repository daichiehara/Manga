using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Manga.Server.Data;
using Manga.Server.Models;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotification()
        {
            return await _context.Notification.ToListAsync();
        }

        // GET: api/Notifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Notification>> GetNotification(int id)
        {
            var notification = await _context.Notification.FindAsync(id);

            if (notification == null)
            {
                return NotFound();
            }

            return notification;
        }

        // PUT: api/Notifications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotification(int id, Notification notification)
        {
            if (id != notification.Id)
            {
                return BadRequest();
            }

            _context.Entry(notification).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificationExists(id))
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

        // POST: api/Notifications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Notification>> PostNotification(Notification notification)
        {
            _context.Notification.Add(notification);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotification", new { id = notification.Id }, notification);
        }

        // DELETE: api/Notifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notification.FindAsync(id);
            if (notification == null)
            {
                return NotFound();
            }

            _context.Notification.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public static async Task CreateNotificationsAsync(ApplicationDbContext context, int sellId, string currentUserId, string currentUserNickName)
        {
            // 出品者に通知を送信
            var sell = await context.Sell.FindAsync(sellId);

            if (sell != null)
            {
                // すべてのリプライを取得
                var allReplies = await context.Reply
                    .Where(r => r.SellId == sellId && r.UserAccountId != currentUserId)
                    .ToListAsync();

                var uniqueUserIds = allReplies
                    .Select(r => r.UserAccountId)
                    .Distinct()
                    .ToList();

                var otherCommentersCount = uniqueUserIds.Count;
                var message = otherCommentersCount > 0
                    ? $"{currentUserNickName}さん、他{otherCommentersCount}名が{sell.Title}にコメントしました。"
                    : $"{currentUserNickName}さんが{sell.Title}にコメントしました。";

                // 出品者に通知を送信
                if (sell.UserAccountId != currentUserId)
                {
                    await CreateNotificationAsync(
                        context,
                        message,
                        Models.Type.Reply,
                        sell.UserAccountId,
                        sellId
                    );
                }

                // 過去にコメントをしたユーザーに通知を送信
                foreach (var userId in uniqueUserIds)
                {
                    if (userId != sell.UserAccountId)
                    {
                        await CreateNotificationAsync(
                            context,
                            message,
                            Models.Type.Reply,
                            userId,
                            sellId
                        );
                    }
                }
            }
        }

        public static async Task CreateNotificationAsync(ApplicationDbContext context, string message, Models.Type type, string userAccountId, int? sellId)
        {
            var existingNotification = await context.Notification
                .FirstOrDefaultAsync(n => n.Type == type && n.SellId == sellId && n.UserAccountId == userAccountId);

            if (existingNotification != null)
            {
                // 既存の通知が存在する場合は、メッセージを更新してIsReadをfalseに設定
                existingNotification.Message = message;
                existingNotification.IsRead = false;
                existingNotification.UpdatedDateTime = DateTime.UtcNow;
            }
            else
            {
                // 新しい通知を作成
                var notification = new Notification
                {
                    Message = message,
                    Type = type,
                    IsRead = false,
                    UpdatedDateTime = DateTime.UtcNow,
                    UserAccountId = userAccountId,
                    SellId = sellId
                };

                context.Notification.Add(notification);
            }

            await context.SaveChangesAsync();
        }

        private bool NotificationExists(int id)
        {
            return _context.Notification.Any(e => e.Id == id);
        }
    }
}
