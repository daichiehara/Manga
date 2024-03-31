using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class WishList
    {
        public int WishListId { get; set; }

        [Required(ErrorMessage = "タイトルを選択してください。")]
        [Display(Name = "作品タイトル")]
        public string Title { get; set; }

        public string UserAccountId { get; set; }
        public virtual UserAccount UserAccount { get; set; }
    }
}
