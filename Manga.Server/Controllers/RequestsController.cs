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
    public class RequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;

        public RequestsController(ApplicationDbContext context, UserManager<UserAccount> userManager)
        {
            _context = context;
            _userManager = userManager;
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
                await NotificationsController.SendExchangeRequestNotification(_context, request, responderSell);
            }

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
