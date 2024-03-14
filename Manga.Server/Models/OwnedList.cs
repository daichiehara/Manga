using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Manga.Server.Models
{
    public class OwnedList
    {
        public int OwnedListId { get; set; }

        [Display(Name = "作品タイトル")]
        public string Title { get; set; }

        public string UserAccountId { get; set; }
        public virtual UserAccount UserAccount { get; set; }
    }
}
