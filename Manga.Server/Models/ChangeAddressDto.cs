using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class ChangeAddressDto
    {
        [Display(Name = "郵便番号")]
        public string? PostalCode { get; set; }

        [Display(Name = "都道府県")]
        public string? Prefecture { get; set; }

        [Display(Name = "市区町村・地名・丁目")]
        public string? Address1 { get; set; }

        [Display(Name = "それ以降の住所")]
        public string? Address2 { get; set; }
    }
}
