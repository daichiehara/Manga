using Amazon.S3.Model;
using Amazon.S3;

namespace Manga.Server
{
    public class S3Service
    {
        private const string IdVerificationBucketName = "tocaeru-idverification-image";
        private const string MangaImageBucketName = "manga-img-bucket";

        public async Task<string> UploadIdVerificationFileToS3Async(Stream fileStream, string fileName, string contentType)
        {
            var uploadRequest = new PutObjectRequest
            {
                InputStream = fileStream,
                BucketName = IdVerificationBucketName,
                Key = fileName,
                ContentType = contentType
            };

            await new AmazonS3Client().PutObjectAsync(uploadRequest);
            return $"https://{IdVerificationBucketName}.s3.amazonaws.com/{fileName}";
        }

        public async Task<string> ProcessIdVerificationImageAsync(IFormFile file)
        {
            if (file.Length > 0)
            {
                using var image = await Image.LoadAsync(file.OpenReadStream());
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (extension == ".jpg" || extension == ".jpeg")
                {
                    return await UploadIdVerificationFileToS3Async(file.OpenReadStream(), file.FileName, "image/jpeg");
                }
                else if (extension == ".png")
                {
                    return await UploadIdVerificationFileToS3Async(file.OpenReadStream(), file.FileName, "image/png");
                }
                else if (extension == ".gif")
                {
                    return await UploadIdVerificationFileToS3Async(file.OpenReadStream(), file.FileName, "image/gif");
                }
                else
                {
                    using var memoryStream = new MemoryStream();
                    await image.SaveAsPngAsync(memoryStream);
                    memoryStream.Position = 0;
                    var newFileName = Path.GetFileNameWithoutExtension(file.FileName) + ".png";
                    return await UploadIdVerificationFileToS3Async(memoryStream, newFileName, "image/png");
                }
            }
            return null;
        }

        public async Task<string> UploadMangaImageToS3Async(Stream fileStream, string fileName)
        {
            var uploadRequest = new PutObjectRequest
            {
                InputStream = fileStream,
                BucketName = MangaImageBucketName,
                Key = fileName,
                ContentType = "image/webp"
            };

            await new AmazonS3Client().PutObjectAsync(uploadRequest);
            return $"https://{MangaImageBucketName}.s3.amazonaws.com/{fileName}";
        }

        public async Task<string> ProcessMangaImageAsync(IFormFile file)
        {
            if (file.Length > 0)
            {
                using var image = await Image.LoadAsync(file.OpenReadStream());
                var newFileName = Guid.NewGuid().ToString() + ".webp";

                using var memoryStream = new MemoryStream();
                await image.SaveAsWebpAsync(memoryStream);
                memoryStream.Position = 0;

                return await UploadMangaImageToS3Async(memoryStream, newFileName);
            }
            return null;
        }

        public async Task DeleteFileFromS3Async(string fileName, string bucketName)
        {
            var deleteObjectRequest = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = fileName
            };

            await new AmazonS3Client().DeleteObjectAsync(deleteObjectRequest);
        }
    }
}
