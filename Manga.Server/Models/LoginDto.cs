using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class LoginDto
    {
        [Required(ErrorMessage = "メールアドレスを入力してください。")]
        [EmailAddress(ErrorMessage = "有効なメールアドレスではありません。")]
        public string Email {  get; set; }
        
        [Required(ErrorMessage = "パスワードを入力してください。")]
        public string Password { get; set; }
    }
}
