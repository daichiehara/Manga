using System.ComponentModel.DataAnnotations.Schema;

namespace Manga.Server.Models
{
    [Table("manga_titles")]
    public class MangaTitle
    {
        public int Id { get; set; }

        [Column("main_title")]
        public string? MainTitle { get; set; }

        [Column("yomi_title")]
        public string? YomiTitle { get; set; }

        [Column("author")]
        public string? Author { get; set; }
    }
}
