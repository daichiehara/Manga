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
using System.Web;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;

        public ReportsController(ApplicationDbContext context, UserManager<UserAccount> userManager, IEmailSender emailSender, IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _emailSender = emailSender;
            _configuration = configuration;
        }

        // GET: api/Reports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Report>>> GetReport()
        {
            return await _context.Report.ToListAsync();
        }

        // GET: api/Reports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> GetReport(int id)
        {
            var report = await _context.Report.FindAsync(id);

            if (report == null)
            {
                return NotFound();
            }

            return report;
        }

        // PUT: api/Reports/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReport(int id, Report report)
        {
            if (id != report.ReportId)
            {
                return BadRequest();
            }

            _context.Entry(report).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportExists(id))
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

        // POST: api/Reports
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Report>> PostReport(Report report)
        {
            _context.Report.Add(report);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReport", new { id = report.ReportId }, report);
        }

        [Authorize]
        [HttpPost("Report")]
        public async Task<IActionResult> Report([FromBody] ReportDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("ユーザーが認証されていません。");
            }

            object reportTarget = null;
            switch (request.ReportType)
            {
                case ReportType.Sell:
                    reportTarget = await _context.Sell.FindAsync(request.Id);
                    if (reportTarget == null)
                        return NotFound("指定された出品が見つかりません。");
                    break;
                case ReportType.Reply:
                    reportTarget = await _context.Reply.FindAsync(request.Id);
                    if (reportTarget == null)
                        return NotFound("指定されたコメントが見つかりません。");
                    break;
                default:
                    return BadRequest("無効なレポートタイプです。");
            }

            var report = await CreateAndSaveReport(userId, request);
            await SendReportNotificationEmail(report, reportTarget);

            return Ok(new { message = "通報が正常に送信されました。" });
        }

        private async Task<Report> CreateAndSaveReport(string userId, ReportDto request)
        {
            string encodedMessage = HttpUtility.HtmlEncode(request.Message);
            var report = new Report
            {
                Message = encodedMessage,
                Created = DateTime.UtcNow,
                UserAccountId = userId,
                ReportType = request.ReportType,
                SellId = request.ReportType == ReportType.Sell ? request.Id : null,
                ReplyId = request.ReportType == ReportType.Reply ? request.Id : null
            };
            _context.Report.Add(report);
            await _context.SaveChangesAsync();
            return report;
        }

        private async Task SendReportNotificationEmail(Report report, object reportTarget)
        {
            var adminEmail = _configuration["AdminSettings:Email"] ?? "support@tocaeru.com";
            var subject = report.ReportType == ReportType.Sell ? "出品に対して通報がありました。" : "コメントに対して通報がありました。";

            string targetContent = report.ReportType == ReportType.Sell
                ? HttpUtility.HtmlEncode(((Sell)reportTarget).Title)
                : HttpUtility.HtmlEncode(((Reply)reportTarget).Message);

            var messageBody = string.Format(
                Resources.EmailTemplates.ReportMessage,
                HttpUtility.HtmlEncode(report.ReportType.ToString()),
                report.ReportId,
                report.Created.ToString("yyyy/MM/dd HH:mm:ss"),
                HttpUtility.HtmlEncode(report.UserAccountId),
                targetContent,
                HttpUtility.HtmlEncode(report.Message)
            );

            await _emailSender.SendEmailAsync(adminEmail, subject, messageBody);
        }

        // DELETE: api/Reports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var report = await _context.Report.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            _context.Report.Remove(report);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReportExists(int id)
        {
            return _context.Report.Any(e => e.ReportId == id);
        }
    }
}
