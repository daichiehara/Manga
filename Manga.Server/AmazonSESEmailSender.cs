﻿using Amazon;
using Amazon.SimpleEmail.Model;
using Amazon.SimpleEmail;
using Microsoft.AspNetCore.Identity.UI.Services;
using Azure.Core;
using System.Web;

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

        public async Task SendEmailAsync(string receiverAddress, string subject, string htmlBody)
        {
            // Change to your from email
            string formattedSenderAddress = $"\"{_fromName}\" <{_fromEmail}>";
            // Change to your region
            using (var client = new AmazonSimpleEmailServiceClient(RegionEndpoint.APNortheast1))
            {
                var sendRequest = new SendEmailRequest
                {
                    Source = formattedSenderAddress,
                    Destination = new Destination
                    {
                        ToAddresses =
                        new List<string> { receiverAddress }
                    },
                    Message = new Message
                    {
                        Subject = new Content(subject),
                        Body = new Body
                        {
                            Html = new Content
                            {
                                Charset = "UTF-8",
                                Data = htmlBody
                            },
                            Text = new Content
                            {
                                Charset = "UTF-8",
                                Data = HttpUtility.HtmlDecode(htmlBody)
                            }
                        }
                    }
                };
                var response = await client.SendEmailAsync(sendRequest);
            }
        }
    }
}
