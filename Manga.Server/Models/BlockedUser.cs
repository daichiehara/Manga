namespace Manga.Server.Models
{
    public class BlockedUser
    {
        public int Id { get; set; }
        public string BlockerId { get; set; }  // ブロックした人
        public string BlockedId { get; set; }  // ブロックされた人
        public DateTime Created { get; set; }

        public virtual UserAccount Blocker { get; set; }
        public virtual UserAccount Blocked { get; set; }
    }
}
