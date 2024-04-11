namespace Manga.Server.Models
{
    public class NotificationsDto
    {
        public int SellId {  get; set; }
        public string Message { get; set; }
        public string SellImage { get; set; }
        public DateTime UpdatedDateTime { get; set; }
        public Type Type { get; set; }
    }
}
