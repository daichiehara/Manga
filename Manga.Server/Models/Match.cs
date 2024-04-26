using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Manga.Server.Models
{
    public class Match
    {
        public int MatchId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [ForeignKey("RequestId")]
        public virtual Request Request { get; set; }

        [Required]
        public DateTime Created { get; set; }
    }
}
