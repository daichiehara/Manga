namespace Manga.Server.Models
{
    public class SellInfoDto
    {
        public int SellId { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public RequestStatus? RequestStatus { get; set; }
    }
}
