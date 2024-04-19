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
using Microsoft.AspNetCore.Identity.UI.Services;
using Humanizer.Localisation;
using Microsoft.Extensions.Hosting;
using System.Globalization;
using System.Resources;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;
        private readonly IEmailSender _emailSender;

        public ContactsController(ApplicationDbContext context, UserManager<UserAccount> userManager, IEmailSender emailSender)
        {
            _context = context;
            _userManager = userManager;
            _emailSender = emailSender;
        }

        // GET: api/Contacts
        /*
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContact()
        {
            return await _context.Contact.ToListAsync();
        }
        */
        [HttpGet]
        public async Task<IActionResult> GetAutofillDetails()
        {
            var userId = _userManager.GetUserId(User); // Get the user ID from the User Claims
            if (userId == null)
            {
                return NotFound(); // User is not logged in
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var autofillData = new
            {
                Name = user.NickName,
                Email = user.Email
            };

            return Ok(autofillData);
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contact.FindAsync(id);

            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        // PUT: api/Contacts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            if (id != contact.ContactId)
            {
                return BadRequest();
            }

            _context.Entry(contact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
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

        // POST: api/Contacts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*
        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact(Contact contact)
        {
            _context.Contact.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContact", new { id = contact.ContactId }, contact);
        }
        */

        [HttpPost]
        public async Task<IActionResult> CreateContact([FromBody] ContactPostDto contactDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Returns error if the DTO does not meet required validation
            }

            var contact = new Contact
            {
                Name = contactDto.Name,
                Email = contactDto.Email,
                Message = contactDto.Message
            };

            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                contact.UserAccountId = user.Id;
            }

            try
            {
                _context.Contact.Add(contact);
                await _context.SaveChangesAsync(); // Save the contact information to the database

                // メール送信
                // リソースファイルからメール本文を読み込む
                string escapedName = System.Net.WebUtility.HtmlEncode(contact.Name);
                string escapedEmail = System.Net.WebUtility.HtmlEncode(contact.Email);
                string escapedMessage = System.Net.WebUtility.HtmlEncode(contact.Message);

                var body = string.Format(Resources.EmailTemplates.ContactMessage, escapedName, escapedEmail, escapedMessage);

                await _emailSender.SendEmailAsync(contact.Email, "お問い合わせ確認", body);
                await _emailSender.SendEmailAsync("d.ehara2019@gmail.com", "お問い合わせがありました。", $"お問い合わせがありました。<br /><br />{escapedEmail}<br />{escapedName}<br />{escapedMessage}");

                return Ok(new { message = "Contact information saved and confirmation email sent successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while saving the contact information or sending the email.");
            }
        }

        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contact.FindAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contact.Remove(contact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ContactExists(int id)
        {
            return _context.Contact.Any(e => e.ContactId == id);
        }
    }
}
