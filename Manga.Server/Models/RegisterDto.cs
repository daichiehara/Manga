using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "メールアドレスが入力されていません。")]
        public string Email { get; set; }

        [Required(ErrorMessage = "ユーザー名が入力されていません。")]
        public string NickName { get; set; }

        [Required(ErrorMessage = "パスワードが入力されていません。")]
        public string Password { get; set; }
    }
}
