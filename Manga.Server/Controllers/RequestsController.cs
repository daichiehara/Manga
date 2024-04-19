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

        [HttpPost]
        public async Task<IActionResult> CreateExchangeRequest([FromBody] RequestPostDto exchangeRequestDto)
        {
            var userId = _userManager.GetUserId(User); // 交換申請者のユーザーIDを取得
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // 交換対象のSellが存在するか確認
            var responderSell = await _context.Sell.FindAsync(exchangeRequestDto.ResponderSellId);
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
