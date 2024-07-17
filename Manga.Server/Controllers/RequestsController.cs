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
using Amazon.SimpleEmail.Model;
using Microsoft.AspNetCore.Identity.UI.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Web;
using Google.Api;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;
        private readonly IEmailSender _emailSender;

        public RequestsController(ApplicationDbContext context, UserManager<UserAccount> userManager, IEmailSender emailSender)
        {
            _context = context;
            _userManager = userManager;
            _emailSender = emailSender;
        }

        // GET: api/Requests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Request>>> GetRequest()
        {
            return await _context.Request.ToListAsync();
        }

        // GET: api/Requests/5
        /*
        [HttpGet("{id}")]
        public async Task<ActionResult<Request>> GetRequest(int id)
        {
            var request = await _context.Request.FindAsync(id);

            if (request == null)
            {
                return NotFound();
            }

            return request;
        }
        */

        // PUT: api/Requests/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRequest(int id, Request request)
        {
            if (id != request.RequestId)
            {
                return BadRequest();
            }

            _context.Entry(request).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RequestExists(id))
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

        // POST: api/Requests
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*
        [HttpPost]
        public async Task<ActionResult<Request>> PostRequest(Request request)
        {
            _context.Request.Add(request);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRequest", new { id = request.RequestId }, request);
        }
        */
        /*
        [HttpPost]
        public async Task<IActionResult> CreateExchangeRequest([FromBody] RequestPostDto exchangeRequestDto)
        {
            var userId = _userManager.GetUserId(User); // 交換申請者のユーザーIDを取得
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // 交換対象のSellが存在するか確認
            var responderSell = await _context.Sell
                .Include(s => s.UserAccount) // UserAccount を含めてデータをロード
                .Include(s => s.UserAccount.WishLists)
                .FirstOrDefaultAsync(s => s.SellId == exchangeRequestDto.ResponderSellId);
            if (responderSell == null)
            {
                return NotFound("交換対象の出品が見つかりません。");
            }

            var createdRequests = new List<Request>();

            // 交換申請を作成し、データベースに保存
            foreach (var requesterSellId in exchangeRequestDto.RequesterSellIds)
            {
                var requesterSell = await _context.Sell.FindAsync(requesterSellId);
                if (requesterSell == null || requesterSell.UserAccountId != userId)
                {
                    continue; // 出品が見つからない、または出品者が申請者自身でない場合はスキップ
                }

                // WishListにrequesterSellのTitleが含まれているか確認
                if (!responderSell.UserAccount.WishLists.Any(wl => wl.Title == requesterSell.Title))
                {
                    continue; // WishListに含まれない場合はスキップ
                }

                var request = new Request
                {
                    RequesterId = userId,
                    RequesterSellId = requesterSellId,
                    ResponderId = responderSell.UserAccountId,
                    ResponderSellId = exchangeRequestDto.ResponderSellId,
                    Status = RequestStatus.Pending,
                    Create = DateTime.UtcNow
                };

                _context.Request.Add(request);
                createdRequests.Add(request);
            }

            await _context.SaveChangesAsync();

            if (createdRequests.Count == 0)
            {
                return BadRequest("交換申請に失敗しました。。条件に一致する出品が存在しないか、既に申請済みの可能性があります。");
            }

            // 作成された交換申請ごとに通知を送信
            foreach (var request in createdRequests)
            {
                // 相手からの交換申請を検索
                var reciprocalRequest = await _context.Request
                    .FirstOrDefaultAsync(r => r.RequesterId == request.ResponderId
                        && r.ResponderId == request.RequesterId
                        && r.RequesterSellId == request.ResponderSellId
                        && r.ResponderSellId == request.RequesterSellId
                        && r.Status == RequestStatus.Pending);

                if (reciprocalRequest != null)
                {
                    // 両者の交換申請が存在する場合、Matchを作成
                    var match = new Match
                    {
                        FirstRequestId = request.RequestId,
                        SecondRequestId = reciprocalRequest.RequestId,
                        Created = DateTime.UtcNow
                    };

                    _context.Match.Add(match);

                    // 両方の交換申請のステータスを更新
                    request.Status = RequestStatus.Approved;
                    reciprocalRequest.Status = RequestStatus.Approved;

                    // Sellの状態を更新
                    request.RequesterSell.SellStatus = SellStatus.Established;
                    responderSell.SellStatus = SellStatus.Established;

                    await _context.SaveChangesAsync();

                    // 交換する出品と交換対象の出品のタイトルを取得
                    var requesterSellTitle = request.RequesterSell.Title;
                    var responderSellTitle = responderSell.Title;

                    // 通知のメッセージを作成
                    string message = $"「{requesterSellTitle}」と「{responderSellTitle}」の交換が成立しました。内容を確認の上発送をお願いします。";

                    // 通知を作成し、データベースに保存
                    await NotificationsController.CreateNotificationAsync(
                        _context,
                        message,
                        Models.Type.Match,
                        request.RequesterId,
                        request.RequesterSellId
                    );

                    await NotificationsController.CreateNotificationAsync(
                        _context,
                        message,
                        Models.Type.Match,
                        request.ResponderId,
                        request.ResponderSellId
                    );
                }
                else
                {
                    await NotificationsController.SendExchangeRequestNotification(_context, request, responderSell);


                    var body = string.Format(Resources.EmailTemplates.RequestMessage, responderSell.UserAccount.NickName, responderSell.Title, request.RequesterSell.Title);
                    await _emailSender.SendEmailAsync(responderSell.UserAccount.Email, "あなたの出品に交換申請がありました。", body);
                }
            }

            var establishedRequesterSellIds = createdRequests
                .Where(r => r.Status == RequestStatus.Approved)
                .Select(r => r.RequesterSellId)
                .ToList();

            var establishedResponderSellIds = createdRequests
                .Where(r => r.Status == RequestStatus.Approved)
                .Select(r => r.ResponderSellId)
                .ToList();

            var unestablishedRequests = await _context.Request
                .Where(r =>
                    (establishedRequesterSellIds.Contains(r.RequesterSellId) || establishedResponderSellIds.Contains(r.ResponderSellId)) &&
                    r.Status == RequestStatus.Pending)
                .ToListAsync();

            foreach (var request in unestablishedRequests)
            {
                request.Status = RequestStatus.Rejected;
            }

            await _context.SaveChangesAsync();


            return Ok("交換申請が正常に作成されました。");
        }
        */

        [HttpPost]
        public async Task<IActionResult> CreateExchangeRequest([FromBody] RequestPostDto exchangeRequestDto)
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var responderSell = await _context.Sell
                    .Include(s => s.UserAccount)
                    .Include(s => s.UserAccount.WishLists)
                    .FirstOrDefaultAsync(s => s.SellId == exchangeRequestDto.ResponderSellId);
                if (responderSell == null)
                {
                    return NotFound("交換対象の出品が見つかりません。");
                }

                if (responderSell.SellStatus == SellStatus.Established)
                {
                    return NotFound("相手の出品はすでに交換成立済みです。");
                }

                if (responderSell.SellStatus == SellStatus.Suspended || responderSell.SellStatus == SellStatus.Draft)
                {
                    return NotFound("相手の出品は現在非公開です。");
                }

                // 既存のリクエストを確認
                var existingRequests = await _context.Request
                    .Where(r => r.RequesterId == userId && r.ResponderSellId == exchangeRequestDto.ResponderSellId)
                    .ToListAsync();

                // Withdrawn以外のステータスがある場合はエラー
                if (existingRequests.Any(r => r.Status != RequestStatus.Withdrawn))
                {
                    return BadRequest("この出品に対して既に有効な交換申請が存在します。");
                }

                // 既存のWithdrawnリクエストを削除
                _context.Request.RemoveRange(existingRequests);
                await _context.SaveChangesAsync();

                var createdRequests = new List<(Request Request, Sell RequesterSell)>();
                var matchCreated = false;

                foreach (var requesterSellId in exchangeRequestDto.RequesterSellIds)
                {
                    var requesterSell = await _context.Sell
                        .Include(s => s.UserAccount)
                        .FirstOrDefaultAsync(s => s.SellId == requesterSellId);
                    if (requesterSell.SellStatus == SellStatus.Established)
                    {
                        return NotFound("あなたの出品はすでに交換成立済みです。");
                    }
                    if (requesterSell == null || requesterSell.UserAccountId != userId)
                    {
                        continue;
                    }

                    var reciprocalRequest = await _context.Request
                        .FirstOrDefaultAsync(r => r.RequesterId == responderSell.UserAccountId
                            && r.ResponderId == userId
                            && r.RequesterSellId == exchangeRequestDto.ResponderSellId
                            && r.ResponderSellId == requesterSellId
                            && r.Status == RequestStatus.Pending);

                    if (reciprocalRequest != null)
                    {
                        reciprocalRequest.Status = RequestStatus.Approved;
                        requesterSell.SellStatus = SellStatus.Established;
                        responderSell.SellStatus = SellStatus.Established;

                        var match = new Match
                        {
                            RequestId = reciprocalRequest.RequestId,
                            Created = DateTime.UtcNow
                        };

                        _context.Match.Add(match);
                        await _context.SaveChangesAsync();

                        await SendNotificationsAndEmails(requesterSell, responderSell);
                        await UpdatePendingRequests(requesterSellId, exchangeRequestDto.ResponderSellId);

                        matchCreated = true;
                        break;
                    }
                    else
                    {
                        var request = new Request
                        {
                            RequesterId = userId,
                            RequesterSellId = requesterSellId,
                            ResponderId = responderSell.UserAccountId,
                            ResponderSellId = exchangeRequestDto.ResponderSellId,
                            Status = RequestStatus.Pending,
                            Create = DateTime.UtcNow
                        };

                        _context.Request.Add(request);
                        createdRequests.Add((request, requesterSell));
                    }
                }

                if (matchCreated)
                {
                    await transaction.CommitAsync();  // トランザクションをコミット
                    return Ok("交換が成立しました。");
                }

                if (createdRequests.Count > 0)
                {
                    await _context.SaveChangesAsync();
                    await SendConsolidatedExchangeRequestNotification(responderSell, createdRequests);
                    await transaction.CommitAsync();
                    return Ok("交換申請が正常に作成されました。");
                }

                await transaction.RollbackAsync();
                return BadRequest("交換申請に失敗しました。条件に一致する出品が存在しないか、既に申請済みの可能性があります。");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // エラーログを記録
                return StatusCode(500, "交換申請の処理中にエラーが発生しました。");
            }
        }

        private async Task SendConsolidatedExchangeRequestNotification(Sell responderSell, List<(Request Request, Sell RequesterSell)> createdRequests)
        {
            var requestDetails = createdRequests.Select(r => $"<li>「{HttpUtility.HtmlEncode(r.RequesterSell.Title)}」</li>").ToList();

            // 交換申請の件数を取得
            var exchangeRequestCount = await _context.Request
                .CountAsync(r => r.ResponderSellId == responderSell.SellId && r.Status == RequestStatus.Pending || r.Status == RequestStatus.Withdrawn);

            // 通知のメッセージを作成
            var message = $"あなたの出品「{responderSell.Title}」に {exchangeRequestCount} 件の交換申請があります。";

            // 通知の作成（アプリ内）
            await NotificationsController.CreateNotificationAsync(
                _context,
                message,
                Models.Type.Request,
                responderSell.UserAccountId,
                responderSell.SellId
            );

            // メールの送信
            var emailBody = string.Format(Resources.EmailTemplates.ConsolidatedRequestMessage,
                HttpUtility.HtmlEncode(responderSell.UserAccount.NickName),
                HttpUtility.HtmlEncode(responderSell.Title),
                string.Join("\n", requestDetails)
            );
            await _emailSender.SendEmailAsync(responderSell.UserAccount.Email, "あなたの出品に交換申請がありました。", emailBody);
        }

        private async Task UpdatePendingRequests(int requesterSellId, int responderSellId)
        {
            var pendingRequests = await _context.Request
                .Where(r =>
                    (r.RequesterSellId == requesterSellId || r.ResponderSellId == responderSellId) &&
                    r.Status == RequestStatus.Pending)
                .ToListAsync();

            foreach (var request in pendingRequests)
            {
                request.Status = RequestStatus.Rejected;
            }

            await _context.SaveChangesAsync();
        }

        private async Task SendNotificationsAndEmails(Sell requesterSell, Sell responderSell)
        {
            string message = $"「{requesterSell.Title}」と「{responderSell.Title}」の交換が成立しました。内容を確認の上、発送をお願いします。";

            await NotificationsController.CreateNotificationAsync(_context, message, Models.Type.Match, requesterSell.UserAccountId, requesterSell.SellId);
            await NotificationsController.CreateNotificationAsync(_context, message, Models.Type.Match, responderSell.UserAccountId, responderSell.SellId);

            var responderbody = string.Format(Resources.EmailTemplates.MatchMessage, responderSell.Title, requesterSell.Title);
            await _emailSender.SendEmailAsync(responderSell.UserAccount.Email, "あなたの出品の交換が成立しました。", responderbody);

            var requesterbody = string.Format(Resources.EmailTemplates.MatchMessage, requesterSell.Title, responderSell.Title);
            await _emailSender.SendEmailAsync(requesterSell.UserAccount.Email, "あなたの出品の交換が成立しました。", requesterbody);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RequestedGetDto>> GetExchangeRequests(int id)
        {
            var responderSell = await _context.Sell
                .Where(s => s.SellId == id)
                .Select(s => new {
                    s.SellId,
                    s.Title,
                    s.SellStatus,
                    s.DeletedRequestCount,
                    ImageUrl = s.SellImages
                        .OrderBy(i => i.Order)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (responderSell == null)
            {
                return NotFound("No sell found with the given SellId.");
            }

            var requestQuery = _context.Request.Where(r => r.ResponderSellId == id && r.Status == RequestStatus.Pending || r.Status == RequestStatus.Approved);

            var requesterSellsInfo = await requestQuery
                .Select(r => new
                {
                    SellId = r.RequesterSellId,
                    Title = r.RequesterSell.Title,
                    ImageUrl = r.RequesterSell.SellImages
                        .OrderBy(i => i.Order)
                        .Select(i => i.ImageUrl)
                        .FirstOrDefault(),
                    RequestStatus = r.Status,
                    SellStatus = r.RequesterSell.SellStatus
                })
                .ToListAsync();

            int suspendedCount = requesterSellsInfo.Count(r => r.SellStatus == SellStatus.Suspended);

            var requesterSells = requesterSellsInfo
                .Where(r => r.SellStatus != SellStatus.Suspended)
                .Select(r => new SellInfoDto
                {
                    SellId = r.SellId,
                    Title = r.Title,
                    ImageUrl = r.ImageUrl,
                    RequestStatus = r.RequestStatus
                })
                .ToList();

            var requestedGetDto = new RequestedGetDto
            {
                ResponderSellId = responderSell.SellId,
                ResponderSellTitle = responderSell.Title,
                ResponderSellImageUrl = responderSell.ImageUrl,
                ResponderSellStatus = responderSell.SellStatus,
                RequesterSells = requesterSells,
                DeletedRequestCount = responderSell.DeletedRequestCount,
                SuspendedCount = suspendedCount
            };

            if (!requestedGetDto.RequesterSells.Any() && suspendedCount == 0)
            {
                return NotFound("No exchange requests found for the given SellId.");
            }

            return Ok(requestedGetDto);
        }

        // GET: api/Matches/User
        [HttpGet("User")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<MatchDto>>> GetMatchesByUser()
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var matches = await _context.Match
                .Include(m => m.Request)
                    .ThenInclude(r => r.RequesterSell)
                        .ThenInclude(s => s.SellImages)
                .Include(m => m.Request)
                    .ThenInclude(r => r.ResponderSell)
                        .ThenInclude(s => s.SellImages)
                .Where(m =>
                    m.Request.RequesterId == userId ||
                    m.Request.ResponderId == userId)
                .ToListAsync();

            var matchDTOs = matches.Select(m =>
            {
                var myTitle = m.Request.RequesterId == userId
                    ? m.Request.RequesterSell.Title
                    : m.Request.ResponderSell.Title;

                var partnerTitle = m.Request.RequesterId == userId
                    ? m.Request.ResponderSell.Title
                    : m.Request.RequesterSell.Title;

                var mySellId = m.Request.RequesterId == userId
                    ? m.Request.RequesterSell.SellId
                    : m.Request.ResponderSell.SellId;

                var partnerSellId = m.Request.RequesterId == userId
                    ? m.Request.ResponderSell.SellId
                    : m.Request.RequesterSell.SellId;

                var myImage = m.Request.RequesterId == userId
                    ? m.Request.RequesterSell.SellImages.OrderBy(si => si.Order).FirstOrDefault()?.ImageUrl
                    : m.Request.ResponderSell.SellImages.OrderBy(si => si.Order).FirstOrDefault()?.ImageUrl;

                var partnerImage = m.Request.RequesterId == userId
                    ? m.Request.ResponderSell.SellImages.OrderBy(si => si.Order).FirstOrDefault()?.ImageUrl
                    : m.Request.RequesterSell.SellImages.OrderBy(si => si.Order).FirstOrDefault()?.ImageUrl;

                return new MatchDto
                {
                    MySellId = mySellId,
                    PartnerSellId = partnerSellId,
                    MyTitle = myTitle,
                    PartnerTitle = partnerTitle,
                    MyImage = myImage,
                    PartnerImage = partnerImage,
                    MatchDate = m.Created
                };
            });

            return Ok(matchDTOs);
        }

        // DELETE: api/Requests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            var request = await _context.Request.FindAsync(id);
            if (request == null)
            {
                return NotFound();
            }

            _context.Request.Remove(request);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("WithdrawRequests/{Id}")]
        public async Task<IActionResult> WithdrawRequests(int Id)
        {
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var requestsToWithdraw = await _context.Request
                    .Where(r => r.RequesterId == userId && r.ResponderSellId == Id && r.Status == RequestStatus.Pending)
                    .ToListAsync();

                if (!requestsToWithdraw.Any())
                {
                    return NotFound("取り下げ可能なリクエストが見つかりません。");
                }

                foreach (var request in requestsToWithdraw)
                {
                    request.Status = RequestStatus.Withdrawn;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok($"{requestsToWithdraw.Count}件のリクエストが取り下げられました。");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // ログにエラーを記録
                return StatusCode(500, "リクエストの取り下げ中にエラーが発生しました。");
            }
        }

        private bool RequestExists(int id)
        {
            return _context.Request.Any(e => e.RequestId == id);
        }
    }
}
