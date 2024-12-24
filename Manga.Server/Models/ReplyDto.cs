using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class ReplyDto
    {
        public int ReplyId { get; set; }

        [Display(Name = "メッセージ")]
        public string Message { get; set; }

        [Display(Name = "投稿日時")]
        public DateTime Created { get; set; }

        [Display(Name = "ユーザーID")]
        public string UserAccount { get; set; }

        [Display(Name = "ニックネーム")]
        public string NickName { get; set; }

        [Display(Name = "プロフィールアイコン")]
        public string? ProfileIcon { get; set; }

        public bool IsDeleted { get; set; }
    }
}
