using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Manga.Server.Models
{
    public class Request
    {
        public int RequestId { get; set; }

        [Required]
        public string RequesterId { get; set; } // 交換申請者のユーザーID
        [ForeignKey("RequesterId")]
        public virtual UserAccount Requester { get; set; }

        [Required]
        public int RequesterSellId { get; set; } // 申請者が交換を希望する自分の出品
        [ForeignKey("RequesterSellId")]
        public virtual Sell RequesterSell { get; set; }

        [Required]
        public string ResponderId { get; set; } // 交換相手のユーザーID
        [ForeignKey("ResponderId")]
        public virtual UserAccount Responder { get; set; }

        [Required]
        public int ResponderSellId { get; set; } // 交換相手が出品した、申請者が欲しい漫画
        [ForeignKey("ResponderSellId")]
        public virtual Sell ResponderSell { get; set; }

        public RequestStatus Status { get; set; } // 交換の状態

        public DateTime Create { get; set; }
    }
    public enum RequestStatus
    {
        Pending = 1,    // 申請中
        Approved = 2,   // 承認された
        Rejected = 3,   // 拒否された
    }
}
