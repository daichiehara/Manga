namespace Manga.Server.Models
{
    public class ItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
    }

    public class OwnedListDto
    {
        public List<ItemDto> OwnedLists { get; set; }
        public List<ItemDto> Sells { get; set; }
    }
}
