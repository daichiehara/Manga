using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class ContactPostDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Message { get; set; }
        public string ReCaptchaToken { get; set; }
    }
}
