namespace Manga.Server.Models
{
    public class RequestedGetDto
    {
        public int ResponderSellId { get; set; }
        public string ResponderSellTitle { get; set; }
        public List<SellInfoDto> RequesterSells { get; set; }
    }
}
