using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class ReplyPostDto
    {
        [Required(ErrorMessage = "SellIdは必須です。")]
        public int SellId { get; set; }

        [Display(Name = "メッセージ")]
        [Required(ErrorMessage = "メッセージを入力してください。")]
        [StringLength(200, ErrorMessage = "メッセージは200文字以内で入力してください。")]
        public string Message { get; set; }

    }
}
