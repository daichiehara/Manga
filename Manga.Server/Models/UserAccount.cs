using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class UserAccount : IdentityUser
    {
        [Display(Name = "ユーザー名")]
        public string NickName {  get; set; }

        [Display(Name = "姓")]
        public string? Sei { get; set; }

        [Display(Name = "名")]
        public string? Mei { get; set; }

        [Display(Name = "郵便番号")]
        public string? PostalCode {  get; set; }

        [Display(Name = "都道府県")]
        public string? Prefecture { get; set; }

        [Display(Name = "市区町村・地名・丁目・番地")]
        public string? Address1 {  get; set; }

        [Display(Name = "建物名・部屋番号など")]
        public string? Address2 { get; set; }
        
        [Display(Name = "本人確認画像")]
        public string? IdVerificationImage {  get; set; }

        [Display(Name = "アイコン")]
        public string? ProfileIcon {  get; set; }

        [Display(Name = "リフレッシュトークン")]
        public string? RefreshToken { get; set; }

        [Display(Name = "リフレッシュトークンの有効期限")]
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public virtual ICollection<WishList> WishLists { get; set; }
        public virtual ICollection<OwnedList> OwnedLists { get; set; }
        public virtual ICollection<Sell> Sells { get; set; }
        public virtual ICollection<Reply> Replys { get; set; }
        public virtual ICollection<MyList> MyLists { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<Contact> Contacts { get; set; }
    }

    public class GoogleAuthRequest
    {
        public string Code { get; set; }
    }
}
