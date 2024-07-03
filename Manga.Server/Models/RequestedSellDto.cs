namespace Manga.Server.Models
{
    public class RequestedSellDto
    {
        public int SellId { get; set; }
        public string Title { get; set; }
        public string ImageUrl { get; set; }
        public DateTime Created { get; set; }
        public RequestStatus Status { get; set; }
    }
}
