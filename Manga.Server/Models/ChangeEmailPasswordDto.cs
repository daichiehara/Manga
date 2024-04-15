using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace Manga.Server.Models
{
    public class ChangeEmailPasswordDto
    {
        [Required]
        [EmailAddress]
        public string NewEmail { get; set; }
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
