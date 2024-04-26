using Amazon.S3.Model;
using Amazon.S3;

namespace Manga.Server
{
    public class S3Service
    {
        public async Task<string> UploadFileToS3Async(Stream fileStream, string fileName, string contentType)
        {
            var bucketName = "tocaeru-idverification-image";
            var uploadRequest = new PutObjectRequest
            {
                InputStream = fileStream,
                BucketName = bucketName,
                Key = fileName,
                ContentType = contentType
            };

            await new AmazonS3Client().PutObjectAsync(uploadRequest);
            return $"https://{bucketName}.s3.amazonaws.com/{fileName}";
        }

        public async Task<string> ProcessImageAsync(IFormFile file)
        {
            if (file.Length > 0)
            {
                using var image = await Image.LoadAsync(file.OpenReadStream());
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (extension == ".jpg" || extension == ".jpeg")
                {
                    return await UploadFileToS3Async(file.OpenReadStream(), file.FileName, "image/jpeg");
                }
                else if (extension == ".png")
                {
                    return await UploadFileToS3Async(file.OpenReadStream(), file.FileName, "image/png");
                }
                else if (extension == ".gif")
                {
                    return await UploadFileToS3Async(file.OpenReadStream(), file.FileName, "image/gif");
                }
                else
                {
                    using var memoryStream = new MemoryStream();
                    await image.SaveAsPngAsync(memoryStream);
                    memoryStream.Position = 0;
                    var newFileName = Path.GetFileNameWithoutExtension(file.FileName) + ".png";
                    return await UploadFileToS3Async(memoryStream, newFileName, "image/png");
                }
            }
            return null;
        }

        public async Task DeleteFileFromS3Async(string fileName)
        {
            var bucketName = "tocaeru-idverification-image";
            var deleteObjectRequest = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = fileName
            };

            await new AmazonS3Client().DeleteObjectAsync(deleteObjectRequest);
        }
    }
}
