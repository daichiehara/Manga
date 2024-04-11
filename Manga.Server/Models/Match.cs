using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Manga.Server.Models
{
    public class Match
    {
        public int MatchId { get; set; }

        [Required]
        public int FirstRequestId { get; set; }

        [ForeignKey("FirstRequestId")]
        public virtual Request FirstRequest { get; set; }

        [Required]
        public int SecondRequestId { get; set; }

        [ForeignKey("SecondRequestId")]
        public virtual Request SecondRequest { get; set; }

        [Required]
        public DateTime Created { get; set; }
    }
}
