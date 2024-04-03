using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Manga.Server
{
    public class CustomJwtBearerEvents : JwtBearerEvents
    {
        private readonly ILogger<CustomJwtBearerEvents> _logger;

        public CustomJwtBearerEvents(ILogger<CustomJwtBearerEvents> logger)
        {
            _logger = logger;
        }

        public override Task Challenge(JwtBearerChallengeContext context)
        {
            var error = context.Error;
            var errorDescription = context.ErrorDescription;

            // エラーの詳細をログに出力する
            _logger.LogError($"JWT validation failed. Error: {error}, Description: {errorDescription}");

            return base.Challenge(context);
        }

        // AuthenticationFailedメソッドを追加
        public override Task AuthenticationFailed(AuthenticationFailedContext context)
        {
            var exception = context.Exception;
            var errorMessage = $"Authentication failed. Exception: {exception?.Message}";

            _logger.LogError(errorMessage);

            return base.AuthenticationFailed(context);
        }

        // MessageReceivedメソッドを追加
        public override Task MessageReceived(MessageReceivedContext context)
        {
            var headers = context.Request.Headers;
            var jwt = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            _logger.LogInformation($"Received request with headers: {headers}");
            _logger.LogInformation($"Received JWT: {jwt}");

            return base.MessageReceived(context);
        }
    }
}
