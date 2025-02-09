﻿using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Manga.Server.Models
{
    public class Reply
    {
        public int ReplyId { get; set; }

        [Display(Name = "メッセージ")]
        [Required]
        [StringLength(400, ErrorMessage = "メッセージは400文字以内で入力してください。")]
        public string Message { get; set; }

        [Display(Name = "投稿日時")]
        public DateTime Created { get; set; }

        public bool IsDeleted { get; set; }

        public string UserAccountId { get; set; }
        public virtual UserAccount UserAccount { get; set; }
        public int SellId { get; set; }
        public virtual Sell Sell { get; set; }

        public virtual ICollection<Report> Reports { get; set; }
    }
}
