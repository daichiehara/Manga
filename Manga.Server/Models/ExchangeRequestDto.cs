namespace Manga.Server.Models
{
    public class ExchangeRequestDto
    {
        public int SellId { get; set; }
        // TitleInfoオブジェクトのリストに変更します
        //public List<TitleInfo> MatchingTitles { get; set; } = new List<TitleInfo>();
        public List<TitleInfo> SellTitles { get; set; } = new List<TitleInfo>();
        public List<TitleInfo> OwnedListTitles { get; set; } = new List<TitleInfo>();
    }

    public class TitleInfo
    {
        public string Title { get; set; }
        //public bool IsFromSell { get; set; } // trueならSellから、falseならOwnedListからのタイトル
    }
}
