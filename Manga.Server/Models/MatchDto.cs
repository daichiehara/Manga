namespace Manga.Server.Models
{
    public class MatchDto
    {
        public string MyTitle { get; set; }
        public string PartnerTitle { get; set; }
        public string MyImage { get; set; }
        public string PartnerImage { get; set; }
        public DateTime MatchDate { get; set; }
    }
}
