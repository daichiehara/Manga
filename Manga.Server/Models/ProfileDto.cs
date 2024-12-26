namespace Manga.Server.Models
{
    public class ProfileDto
    {
        public string UserId { get; set; }
        public string NickName { get; set; }
        public string ProfileIcon { get; set; }
        public bool HasIdVerification { get; set; }
        public bool IsBlocked { get; set; }
        public List<SellListDto> SellList { get; set; }
    }

    public class SellListDto
    {
        public int SellId { get; set; }
        public string SellTitle { get; set; }
        public int? NumberOfBooks { get; set; }
        public SellStatus SellStatus { get; set; }
        public List<WishTitleInfo> WishTitles { get; set; }
        public string SellImage { get; set; }
    }
}
