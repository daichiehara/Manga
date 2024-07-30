using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "パスワードは8文字以上100文字以内です。", MinimumLength = 8)]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Compare("NewPassword", ErrorMessage = "新しいパスワードと確認パスワードが一致しません。")]
        public string ConfirmPassword { get; set; }
    }
}
