using Amazon.SimpleEmail.Model;
using Amazon.SimpleEmail;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace Manga.Server
{
    public class AmazonSESEmailSender : IEmailSender
    {
        private readonly string _fromEmail;
        private readonly string _fromName;

        public AmazonSESEmailSender(string fromEmail, string fromName)
        {
            _fromEmail = fromEmail;
            _fromName = fromName;
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            using (var client = new AmazonSimpleEmailServiceClient(Amazon.RegionEndpoint.USWest2))
            {
                var sendRequest = new SendEmailRequest
                {
                    Source = $"\"{_fromName}\" <{_fromEmail}>",
                    Destination = new Destination
                    {
                        ToAddresses = new List<string> { email }
                    },
                    Message = new Message
                    {
                        Subject = new Content(subject),
                        Body = new Body
                        {
                            Html = new Content
                            {
                                Charset = "UTF-8",
                                Data = message
                            }
                        }
                    }
                };

                try
                {
                    var response = await client.SendEmailAsync(sendRequest);
                    // ログ記録またはエラーハンドリング
                }
                catch (Exception ex)
                {
                    // エラーハンドリング
                    throw;
                }
            }
        }
    }
}
