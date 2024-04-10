namespace Manga.Server.Models
{
    public class RequestPostDto
    {
        public int ResponderSellId { get; set; } // 交換対象のSellのID

        public List<int> RequesterSellIds { get; set; } = new List<int>(); // 交換を希望するSellのIDのリスト
    }
}
