namespace Manga.Server.Models
{
    public class ReplyForSellDto
    {
        public IEnumerable<ReplyDto> Replies { get; set; }
        public bool IsCurrentUserSeller { get; set; }
    }
}
