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

            var updatedRequests = new List<Request>();

            foreach (var requesterSellId in exchangeRequestDto.RequesterSellIds)
            {
                var requesterSell = await _context.Sell
                    .Include(s => s.UserAccount)
                    .FirstOrDefaultAsync(s => s.SellId == requesterSellId);
                if (requesterSell == null || requesterSell.UserAccountId != userId)
                {
                    continue; // 出品が見つからない、または出品者が申請者自身でない場合はスキップ
                }

                //削除検討
                /*
                // WishListにrequesterSellのTitleが含まれているか確認
                if (!responderSell.UserAccount.WishLists.Any(wl => wl.Title == requesterSell.Title))
                {
                    continue; // WishListに含まれない場合はスキップ
                }
                */

                // 相手からの交換申請を検索
                var reciprocalRequest = await _context.Request
                    .FirstOrDefaultAsync(r => r.RequesterId == responderSell.UserAccountId
                        && r.ResponderId == userId
                        && r.RequesterSellId == exchangeRequestDto.ResponderSellId
                        && r.ResponderSellId == requesterSellId
                        && r.Status == RequestStatus.Pending);

                if (reciprocalRequest != null)
                {
                    // 相手からの交換申請が存在する場合、両方の交換申請のステータスを更新
                    reciprocalRequest.Status = RequestStatus.Approved;
                    updatedRequests.Add(reciprocalRequest);

                    // Sellの状態を更新
                    requesterSell.SellStatus = SellStatus.Established;
                    responderSell.SellStatus = SellStatus.Established;

                    // Matchを作成
                    var match = new Match
                    {
                        RequestId = reciprocalRequest.RequestId,
                        Created = DateTime.UtcNow
                    };

                    _context.Match.Add(match);
                    await _context.SaveChangesAsync();

                    // 通知を作成
                    string message = $"「{requesterSell.Title}」と「{responderSell.Title}」の交換が成立しました。内容を確認の上発送をお願いします。";

                    await NotificationsController.CreateNotificationAsync(
                        _context,
                        message,
                        Models.Type.Match,
                        userId,
                        requesterSellId
                    );

                    await NotificationsController.CreateNotificationAsync(
                        _context,
                        message,
                        Models.Type.Match,
                        responderSell.UserAccountId,
                        exchangeRequestDto.ResponderSellId
                    );

                    var responderbody = string.Format(Resources.EmailTemplates.MatchMessage, responderSell.Title, requesterSell.Title);
                    await _emailSender.SendEmailAsync(responderSell.UserAccount.Email, "あなたの出品で交換が成立しました。", responderbody);

                    var requesterbody = string.Format(Resources.EmailTemplates.MatchMessage, requesterSell.Title, responderSell.Title);
                    await _emailSender.SendEmailAsync(requesterSell.UserAccount.Email, "あなたの出品で交換が成立しました。", requesterbody);

                    // matchしたrequesterSellとresponderSellに対してPendingのRequestをすべてRejectedに変更
                    await UpdatePendingRequests(requesterSellId, exchangeRequestDto.ResponderSellId);
                }
                else
                {
                    // 相手からの交換申請が存在しない場合、新しい交換申請を作成
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
                    updatedRequests.Add(request);
                    await _context.SaveChangesAsync();

                    await NotificationsController.SendExchangeRequestNotification(_context, request, responderSell);

                    var body = string.Format(Resources.EmailTemplates.RequestMessage, responderSell.UserAccount.NickName, responderSell.Title, requesterSell.Title);
                    await _emailSender.SendEmailAsync(responderSell.UserAccount.Email, "あなたの出品に交換申請がありました。", body);
                }
            }

            //await _context.SaveChangesAsync();

            if (updatedRequests.Count == 0)
            {
                return BadRequest("交換申請に失敗しました。条件に一致する出品が存在しないか、既に申請済みの可能性があります。");
            }

            return Ok("交換申請が正常に作成されました。");
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

        private bool RequestExists(int id)
        {
            return _context.Request.Any(e => e.RequestId == id);
        }
    }
}
