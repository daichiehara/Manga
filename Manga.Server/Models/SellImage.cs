namespace Manga.Server.Models
{
    public class SellImage
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }

        public int SellId { get; set; }
        public virtual Sell Sell { get; set; }
    }
}
