namespace Manga.Server.Models
{
    public class SellImage
    {
        public int SellImageId { get; set; }
        public string ImageUrl { get; set; }
        public int Order { get; set; }

        public int SellId { get; set; }
        public virtual Sell Sell { get; set; }
    }
}
