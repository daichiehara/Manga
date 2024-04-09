using Amazon.SecretsManager.Model;
using Amazon.SecretsManager;
using System.Text.Json;

namespace Manga.Server
{
    public static class GetAwsSecret
    {
        public static async Task<string> GetApiKeyFromAWSSecretsManager(string keyName)
        {
            string secretName = "Changey";
            string region = "ap-northeast-1";

            IAmazonSecretsManager client = new AmazonSecretsManagerClient(Amazon.RegionEndpoint.GetBySystemName(region));
            GetSecretValueRequest request = new GetSecretValueRequest
            {
                SecretId = secretName,
                VersionStage = "AWSCURRENT"
            };
            GetSecretValueResponse response = await client.GetSecretValueAsync(request);

            // JSONからディクショナリに変換
            var secrets = JsonSerializer.Deserialize<Dictionary<string, string>>(response.SecretString);


            // APIKeyの値を返す
            return secrets[keyName];
        }
    }
}
