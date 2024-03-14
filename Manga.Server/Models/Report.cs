using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class Report
    {
        public int ReportId { get; set; }

        [Display(Name = "内容")]
        public string Message { get; set; }

        [Display(Name = "通報日時")]
        public DateTime Created { get; set; }

        public string UserAccountId { get; set; }
        public virtual UserAccount UserAccount { get; set; }
        public int SellId { get; set; }
        public virtual Sell Sell { get; set; }
    }
}
