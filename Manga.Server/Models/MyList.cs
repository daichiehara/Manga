namespace Manga.Server.Models
{
    public class MyList
    {
        public int MyListId { get; set; }
        public string UserAccountId { get; set; }
        public virtual UserAccount UserAccount { get; set; }
        public int SellId { get; set; }
        public virtual Sell Sell { get; set; }
    }
}
