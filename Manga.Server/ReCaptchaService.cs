using System.Text.Json;

namespace Manga.Server
{
    public class ReCaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _secretKey;

        public ReCaptchaService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _secretKey = configuration["ReCaptcha:SecretKey"];
        }

        public async Task<ReCaptchaVerificationResult> VerifyTokenAsync(string token)
        {
            var response = await _httpClient.GetStringAsync($"https://www.google.com/recaptcha/api/siteverify?secret={_secretKey}&response={token}");
            var result = JsonSerializer.Deserialize<ReCaptchaVerificationResult>(response);
            return result;
        }
    }

    public class ReCaptchaVerificationResult
    {
        public bool Success { get; set; }
        public double Score { get; set; }
        public string Action { get; set; }
        // 他の必要なプロパティを追加
    }
}
