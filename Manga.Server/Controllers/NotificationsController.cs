using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Manga.Server.Data;
using Manga.Server.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;

        public NotificationsController(ApplicationDbContext context, UserManager<UserAccount> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Notifications
        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Notification>>> GetNotification()
        {
            return await _context.Notification.ToListAsync();
        }
        */

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationsDto>>> GetNotifications(int limit = 50)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null)
            {
                return NotFound();
            }

            var notifications = await _context.Notification
                .Where(n => n.UserAccountId == userId)
                .OrderByDescending(n => n.UpdatedDateTime)
                .Take(limit) // 結果の数を制限
                .Select(n => new NotificationsDto
                {
                    SellId = n.SellId ?? 0,
                    Message = n.Message,
                    SellImage = n.Sell != null && n.Sell.SellImages.Any()
                        ? n.Sell.SellImages.OrderBy(si => si.Order).First().ImageUrl
                        : string.Empty,
                    UpdatedDateTime = n.UpdatedDateTime,
                    Type = n.Type,
                })
                .ToListAsync();

            return notifications;
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadNotificationsCount()
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null)
            {
                return NotFound();
            }
            var count = await _context.Notification
                .Where(n => n.UserAccountId == userId && !n.IsRead)
                .CountAsync();
            return count;
        }

        [HttpPost("mark-all-as-read")]
        public async Task<IActionResult> MarkAllNotificationsAsRead()
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null)
            {
                return NotFound();
            }

            var unreadNotifications = await _context.Notification
                .Where(n => n.UserAccountId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return NoContent();
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
                    ? $"{currentUserNickName}さん、他{otherCommentersCount}名が「{sell.Title}」にコメントしました。"
                    : $"{currentUserNickName}さんが「{sell.Title}」にコメントしました。";

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

        public static async Task SendExchangeRequestNotification(ApplicationDbContext context, Request request, Sell responderSell)
        {
            // 交換を申請したユーザーの出品を取得
            var requesterSell = await context.Sell.FindAsync(request.RequesterSellId);

            if (requesterSell == null)
            {
                // 出品が見つからない場合は通知を送信せずにリターン
                return;
            }

            // 交換を申請したユーザーの情報を取得
            var requesterUser = await context.Users.FindAsync(request.RequesterId);

            if (requesterUser == null)
            {
                // ユーザーが見つからない場合は通知を送信せずにリターン
                return;
            }

            // 交換申請の件数を取得
            var exchangeRequestCount = await context.Request
                .CountAsync(r => r.ResponderSellId == responderSell.SellId && r.Status == RequestStatus.Pending);

            // 通知のメッセージを作成
            var message = $"あなたの出品「{responderSell.Title}」に {exchangeRequestCount} 件の交換申請があります。";

            // 通知を作成し、データベースに保存
            await CreateNotificationAsync(
                context,
                message,
                Models.Type.Request,
                request.ResponderId,
                request.ResponderSellId
            );
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
