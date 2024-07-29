using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class Report
    {
        public int ReportId { get; set; }

        [Required]
        [Display(Name = "内容")]
        [StringLength(400, ErrorMessage = "メッセージは400文字以内で入力してください。")]
        public string Message { get; set; }

        [Required]
        [Display(Name = "通報日時")]
        public DateTime Created { get; set; }

        [Required]
        [Display(Name = "通報者")]
        public string UserAccountId { get; set; }
        public virtual UserAccount UserAccount { get; set; }

        [Required]
        [Display(Name = "通報対象の種類")]
        public ReportType ReportType { get; set; }

        // 出品に対する通報の場合
        public int? SellId { get; set; }
        public virtual Sell Sell { get; set; }

        // 返信（コメント）に対する通報の場合
        public int? ReplyId { get; set; }
        public virtual Reply Reply { get; set; }
    }

    public enum ReportType
    {
        [Display(Name = "出品に対する通報")]
        Sell = 1,

        [Display(Name = "コメントに対する通報")]
        Reply = 2
    }
}
