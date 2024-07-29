using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class ReportDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(400, ErrorMessage = "メッセージは400文字以内で入力してください。")]
        public string Message { get; set; }

        [Required]
        public ReportType ReportType { get; set; }
    }
}
