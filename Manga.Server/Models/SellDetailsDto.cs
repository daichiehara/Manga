using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class SellDetailsDto
    {
        public int SellId { get; set; }

        [Display(Name = "作品タイトル")]
        public string Title { get; set; }

        [Display(Name = "発送元の地域")]
        public SendPrefecture SendPrefecture { get; set; }

        [Display(Name = "発送までの日数")]
        public SendDay SendDay { get; set; }

        [Display(Name = "出品日時")]
        public DateTime SellTime { get; set; }

        [Display(Name = "商品状態")]
        public BookState BookState { get; set; }

        [Display(Name = "全巻巻数")]
        public int NumberOfBooks { get; set; }

        [Display(Name = "メッセージ")]
        public string SellMessage { get; set; }

        [Display(Name = "ユーザー名")]
        public string UserName { get; set;}

        [Display(Name = "ユーザーアイコン")]
        public string ProfileIcon { get; set; }

        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<WishTitleInfo> WishTitles { get; set; } = new List<WishTitleInfo>();
    }
}
