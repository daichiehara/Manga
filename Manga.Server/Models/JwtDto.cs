namespace Manga.Server.Models
{
    public class JwtDto
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
