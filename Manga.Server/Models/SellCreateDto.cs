using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class SellCreateDto
    {
        [Display(Name = "作品タイトル")]
        public string? Title { get; set; }

        [Display(Name = "発送元の地域")]
        public SendPrefecture? SendPrefecture { get; set; }

        [Display(Name = "発送までの日数")]
        public SendDay? SendDay { get; set; }

        [Display(Name = "商品状態")]
        public BookState? BookState { get; set; }

        [Display(Name = "全巻巻数")]
        public int? NumberOfBooks { get; set; }

        [Display(Name = "メッセージ")]
        public string? SellMessage { get; set; }

        [Required]
        [Display(Name = "出品状態")]
        public SellStatus SellStatus { get; set; }

        public List<SellImageCreateDto>? SellImages { get; set; }
    }

    public class SellImageCreateDto
    {
        public string? ImageUrl { get; set; }

        public IFormFile? ImageBlob { get; set; }

        public int? Order { get; set; }
    }
}
