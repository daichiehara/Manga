namespace Manga.Server.Models
{
    public class RequestedGetDto
    {
        public int ResponderSellId { get; set; }
        public string ResponderSellTitle { get; set; }
        public string ResponderSellImageUrl { get; set; }
        public SellStatus ResponderSellStatus { get; set; }
        public List<SellInfoDto> RequesterSells { get; set; }
        public int DeletedRequestCount { get; set; } = 0;
    }
}
