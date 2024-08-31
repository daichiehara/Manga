using System.Text.Json;
using System.Text.Json.Serialization;

namespace Manga.Server
{
    public class ReCaptchaService
    {
        private readonly HttpClient _httpClient;
        private readonly string _secretKey;
        private readonly ILogger<ReCaptchaService> _logger;

        public ReCaptchaService(HttpClient httpClient, IConfiguration configuration, ILogger<ReCaptchaService> logger)
        {
            _httpClient = httpClient;
            _secretKey = configuration["ReCaptcha:SecretKey"];
            _logger = logger;
        }

        public async Task<ReCaptchaVerificationResult> VerifyTokenAsync(string token)
        {
            try
            {
                var response = await _httpClient.GetStringAsync($"https://www.google.com/recaptcha/api/siteverify?secret={_secretKey}&response={token}");
                _logger.LogInformation($"reCAPTCHA API Response: {response}");

                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };

                var result = JsonSerializer.Deserialize<ReCaptchaVerificationResult>(response, options);

                if (result == null)
                {
                    _logger.LogWarning("Deserialized result is null");
                    return new ReCaptchaVerificationResult { Success = false, Score = 0, Action = "unknown" };
                }

                _logger.LogInformation($"Deserialized result: Success={result.Success}, Score={result.Score}, Action={result.Action}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in VerifyTokenAsync: {ex.Message}");
                return new ReCaptchaVerificationResult { Success = false, Score = 0, Action = "error" };
            }
        }
    }

    public class ReCaptchaVerificationResult
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("score")]
        public double Score { get; set; }

        [JsonPropertyName("action")]
        public string Action { get; set; }

        [JsonPropertyName("challenge_ts")]
        public string ChallengeTimestamp { get; set; }

        [JsonPropertyName("hostname")]
        public string Hostname { get; set; }

        [JsonPropertyName("error-codes")]
        public string[] ErrorCodes { get; set; }
    }
}
