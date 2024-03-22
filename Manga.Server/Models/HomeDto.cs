namespace Manga.Server.Models
{
    public class WishTitleInfo
    {
        public string Title { get; set; }
        public bool IsOwned { get; set; }
    }

    public class HomeDto
    {
        public int SellId { get; set; }
        public string SellTitle {  get; set; }
        public int NumberOfBooks { get; set; }
        public List<WishTitleInfo> WishTitles { get; set; } = new List<WishTitleInfo>();
        public string SellImage {  get; set; }
    }
}
