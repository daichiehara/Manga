namespace Manga.Server.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public Type Type { get; set; }
        public bool IsRead { get; set; }
        public DateTime UpdatedDateTime { get; set; }

        public string UserAccountId { get; set; }
        public virtual UserAccount UserAccount { get; set; }
        public int? SellId { get; set; }
        public virtual Sell? Sell { get; set; }
    }

    public enum Type
    {
        Reply = 1,
        Request = 2,
    }
}
