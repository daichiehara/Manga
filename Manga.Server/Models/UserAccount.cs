using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class UserAccount : IdentityUser
    {
        [Display(Name = "ユーザー名")]
        public string NickName {  get; set; }

        [Display(Name = "郵便番号")]
        public string? PostalCode {  get; set; }

        [Display(Name = "都道府県")]
        public string? Prefecture { get; set; }

        [Display(Name = "市区町村・地名・丁目")]
        public string? Address1 {  get; set; }

        [Display(Name = "それ以降の住所")]
        public string? Address2 { get; set; }
        
        [Display(Name = "本人確認画像")]
        public string? IdVerificationImage {  get; set; }

        [Display(Name = "アイコン")]
        public string? ProfileIcon {  get; set; }

        public virtual ICollection<WishList> WishLists { get; set; }
        public virtual ICollection<OwnedList> OwnedLists { get; set; }
        public virtual ICollection<Sell> Sells { get; set; }
        public virtual ICollection<Reply> Replys { get; set; }
        public virtual ICollection<MyList> MyLists { get; set; }
    }
}
