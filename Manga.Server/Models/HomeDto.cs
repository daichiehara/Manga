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
        public int? NumberOfBooks { get; set; }
        public SellStatus SellStatus { get; set; }
        public List<WishTitleInfo> WishTitles { get; set; } = new List<WishTitleInfo>();
        public string SellImage {  get; set; }
    }

    public class PaginatedResultDto<T>
    {
        public List<T> Items { get; set; }
        public int TotalItems { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class HomeDataRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<string> GuestOwnedTitles { get; set; } = new List<string>();
    }
}
