using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class Contact
    {
        public int ContactId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Message { get; set; }

        public string? UserAccountId { get; set; }
        public virtual UserAccount? UserAccount { get; set; }
    }
}
