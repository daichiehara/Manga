﻿using Azure.Core;
using Manga.Server.Models;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.V4.Pages.Account.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Manga.Server.Data;
using Microsoft.AspNetCore.Identity.UI.Services;
using Google.Cloud.RecaptchaEnterprise.V1;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Net.Http;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.Encodings.Web;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<UserAccount> _userManager;
        private readonly SignInManager<UserAccount> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly S3Service _s3Service;
        private readonly HttpClient _httpClient;

        public UsersController(ApplicationDbContext context, UserManager<UserAccount> userManager, SignInManager<UserAccount> signInManager, IConfiguration configuration, IEmailSender emailSender, S3Service s3Service, HttpClient httpClient)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailSender = emailSender;
            _s3Service = s3Service;
            _httpClient = httpClient;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var user = new UserAccount
            {
                Email = model.Email,
                UserName = model.Email,
                NickName = model.NickName,
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = Url.Action("ConfirmEmail", "Users",
                    new { userId = user.Id, token = token }, Request.Scheme);

                var body = string.Format(Resources.EmailTemplates.RegisterEmailMessage, confirmationLink);
                await _emailSender.SendEmailAsync(user.Email, "トカエルの仮登録が完了しました！", body);

                await _signInManager.SignInAsync(user, isPersistent: false);
                // JWTトークンを生成
                GenerateJwtToken(user);

                return Ok(new { Message = "登録成功。確認メールを送信しました。" });
            }
            else
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }
        }

        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (userId == null || token == null)
            {
                return Redirect($"{_configuration["FrontendUrl"]}/email-confirmation?status=error&message=Invalid confirmation link");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Redirect($"{_configuration["FrontendUrl"]}/email-confirmation?status=error&message=User not found");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                return Redirect($"{_configuration["FrontendUrl"]}/email-confirmation?status=success");
            }
            else
            {
                return Redirect($"{_configuration["FrontendUrl"]}/email-confirmation?status=error&message=Email confirmation failed");
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                
                var errorResponse = new
                {
                    messageerrors = new Dictionary<string, string[]>
                    {
                        { "Message", new[] { "メールアドレスもしくはパスワードが間違っています。" } }
                    }
                };
                return BadRequest(errorResponse);
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            // ユーザーアカウントにリフレッシュトークンを保存
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(180);
            // データベースに変更を保存
            await _userManager.UpdateAsync(user);

            // アクセストークンをHTTP Only Cookieにセット
            SetTokenCookie("accessToken", token, 30); // 30分間有効

            // リフレッシュトークンを別のHTTP Only Cookieにセット
            SetTokenCookie("RefreshToken", refreshToken, 259200); // 180日間有効

            // メール送信の呼び出し
            //await _emailSender.SendEmailAsync(user.Email, "Login Notification", "You have successfully logged in to your account.");

            return Ok(new { AccessToken = token, RefreshToken = refreshToken });
        }

        [HttpGet("signin-google")]
        public async Task<IActionResult> SignInWithGoogle()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (result.Succeeded)
            {
                var claims = result.Principal.Identities.FirstOrDefault()?.Claims.Select(claim => new
                {
                    claim.Issuer,
                    claim.OriginalIssuer,
                    claim.Type,
                    claim.Value
                });

                var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                var name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
                if (string.IsNullOrEmpty(name))
                {
                    name = claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value;
                }

                // ユーザーがデータベースに存在するかどうかを確認し、必要に応じてユーザーを作成または更新します。
                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    // 新しいユーザーを作成します。
                    user = new UserAccount
                    {
                        Email = email,
                        UserName = email,
                        NickName = name
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                // JWTトークンを生成します。
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();
                // ユーザーアカウントにリフレッシュトークンを保存
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
                // データベースに変更を保存
                await _userManager.UpdateAsync(user);

                // アクセストークンをHTTP Only Cookieにセット
                SetTokenCookie("accessToken", token, 30); // 30分間有効

                // リフレッシュトークンを別のHTTP Only Cookieにセット
                SetTokenCookie("RefreshToken", refreshToken, 259200); // 180日間有効

                return Ok(new { Token = token });
            }

            return BadRequest("Google認証に失敗しました。");
        }


        private string GenerateJwtToken(UserAccount user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public void SetTokenCookie(string key, string token, int expireMinutes)
        {
            // Cookieオプションの設定
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // JavaScriptからのアクセスを禁止
                Expires = DateTime.UtcNow.AddMinutes(expireMinutes), // 有効期限の設定
                Secure = true, // HTTPSを通じてのみCookieを送信
                SameSite = SameSiteMode.None // SameSite属性の設定
                //SameSite = SameSiteMode.Strict, // または None + Secure, クロスオリジンの場合
            };

            // Cookieにトークンを保存
            HttpContext.Response.Cookies.Append(key, token, cookieOptions);
        }

        private string GenerateRefreshToken()
        {
            // ランダムな文字列を生成する簡単な方法です。
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Refresh token is required.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = await _userManager.Users
                    .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

                if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                {
                    return BadRequest("Invalid refresh token.");
                }

                var newAccessToken = GenerateJwtToken(user);
                var newRefreshToken = GenerateRefreshToken();

                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(180);
                await _userManager.UpdateAsync(user);

                SetTokenCookie("accessToken", newAccessToken, 30);
                SetTokenCookie("RefreshToken", newRefreshToken, 259200);

                await transaction.CommitAsync();

                return Ok(new { message = "トークンが正常に更新されました。" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // ログ出力やエラー処理
                return StatusCode(500, "An error occurred while refreshing the token.");
            }
        }

        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            // ユーザーのリフレッシュトークンを無効化する処理
            // これにより、盗まれたトークンが使用されるのを防ぎます。
            var userId = _userManager.GetUserId(User);
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.RefreshToken = null; // リフレッシュトークンをクリア
                await _userManager.UpdateAsync(user);
            }

            // クライアント側のCookieからトークンを削除
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            };
            Response.Cookies.Append("accessToken", "", cookieOptions); // トークンをクリア
            Response.Cookies.Append("RefreshToken", "", cookieOptions); // トークンをクリア

            return Ok(new { message = "ログアウトしました。" });
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // ユーザーが存在しないか、メールが確認されていない場合でも、
                // セキュリティのために同じメッセージを返す
                return Ok(new { message = "パスワード再設定の手順をメールで送信しました。" });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var resetUrl = $"{_configuration["FrontendUrl"]}/reset-password?userId={user.Id}&token={encodedToken}";
            var encodedResetUrl = HtmlEncoder.Default.Encode(resetUrl);

            await _emailSender.SendEmailAsync(
                model.Email,
                "パスワードのリセット",
                $"パスワードをリセットするには、<a href='{HtmlEncoder.Default.Encode(encodedResetUrl)}'>こちらをクリック</a>してください。");

            return Ok(new { message = "パスワード再設定の手順をメールで送信しました。" });
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                // ユーザーが見つからない場合でも、セキュリティのために同じメッセージを返す
                return Ok(new { message = "パスワードがリセットされました。" });
            }

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new { message = "パスワードがリセットされました。" });
            }

            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
        }

        [HttpGet("MyPage")]
        public async Task<IActionResult> GetMyPageInfo()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }

            var myPageInfo = new
            {
                NickName = user.NickName,
                ProfileIcon = user.ProfileIcon,
                HasIdVerificationImage = !string.IsNullOrEmpty(user.IdVerificationImage)
            };

            return Ok(myPageInfo);
        }

        [HttpPost("UpdateAccount")]
        [Authorize]
        public async Task<IActionResult> UpdateAccount([FromBody] ChangeEmailPasswordDto model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            bool isEmailChanged = !string.IsNullOrEmpty(model.NewEmail) && model.NewEmail != user.Email;
            bool isPasswordChangeRequested = !string.IsNullOrEmpty(model.NewPassword) && !string.IsNullOrEmpty(model.OldPassword);

            IdentityResult emailResult = null;
            IdentityResult passwordResult = null;
            bool emailChangeInitiated = false;

            // メールアドレスの変更を試みる
            if (isEmailChanged)
            {
                var token = await _userManager.GenerateChangeEmailTokenAsync(user, model.NewEmail);
                var callbackUrl = Url.Action("ConfirmNewEmail", "Users",
                new
                {
                    userId = user.Id,
                    code = token,
                    changedEmail = model.NewEmail
                },
                Request.Scheme);

                await _emailSender.SendEmailAsync(model.NewEmail, "メールアドレスの変更を完了してください。",
                    $"Changeyをご利用いただきありがとうございます。<br /><br />以下のURLをクリックして、メールアドレスの変更手続きを完了してください。<br /><a href='{callbackUrl}'>{callbackUrl}</a><br /><br />Changeyサポートチーム");
                emailChangeInitiated = true;
                user.UserName = model.NewEmail;
                await _userManager.UpdateAsync(user);
            }

            // パスワードの変更を試みる
            if (isPasswordChangeRequested)
            {
                passwordResult = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
                if (!passwordResult.Succeeded)
                {
                    return BadRequest("Password change failed: " + string.Join("; ", passwordResult.Errors.Select(e => e.Description)));
                }
            }

            // 変更の結果を評価
            if (emailChangeInitiated && isPasswordChangeRequested)
            {
                if (passwordResult.Succeeded)
                    return Ok("An email has been sent to confirm your new email address and your password has been changed successfully. Please check your email to complete the email change.");
            }
            else if (emailChangeInitiated)
            {
                return Ok("An email has been sent to confirm your new email address. Please check your email to complete the change.");
            }
            else if (isPasswordChangeRequested)
            {
                return Ok("Your password has been changed successfully.");
            }
            else
            {
                return Ok("No changes have been made to your account.");
            }

            // 上記のいずれの条件にも該当しない場合に備えたデフォルトのreturn文
            return BadRequest("変更しませんでした。");
        }



        [HttpGet("ConfirmNewEmail")]
        public async Task<IActionResult> ConfirmNewEmail(string userId, string code, string changedEmail)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(code) || string.IsNullOrEmpty(changedEmail))
            {
                return Redirect("/confirm-email.html?status=invalid");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Redirect("/confirm-email.html?status=notfound");
            }

            var result = await _userManager.ChangeEmailAsync(user, changedEmail, code);
            if (result.Succeeded)
            {
                await _userManager.ConfirmEmailAsync(user, code);
                return Redirect("https://localhost:5173/");
            }
            else
            {
                return Redirect("/confirm-email.html?status=error&message=" + Uri.EscapeDataString(string.Join("; ", result.Errors.Select(e => e.Description))));
            }
        }

        [HttpGet("GetAddress")]
        [Authorize]
        public async Task<IActionResult> GetAddress()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }

            var addressDto = new ChangeAddressDto
            {
                Sei = user?.Sei,
                Mei = user?.Mei,
                PostalCode = user.PostalCode,
                Prefecture = user?.Prefecture,
                Address1 = user?.Address1,
                Address2 = user?.Address2
            };

            return Ok(addressDto);
        }

        [HttpPut("UpdateAddress")]
        [Authorize]
        public async Task<IActionResult> UpdateAddress(ChangeAddressDto model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }

            user.Sei = model?.Sei;
            user.Mei = model?.Mei;
            user.PostalCode = model?.PostalCode;
            user.Prefecture = model?.Prefecture;
            user.Address1 = model?.Address1;
            user.Address2 = model?.Address2;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok();
        }

        [HttpGet("hasIdVerificationImage")]
        [Authorize]
        public async Task<IActionResult> HasIdVerificationImage()
        {
            // Retrieve user information from the database
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return NotFound("User not found");

            // Check if the user has an ID verification image uploaded
            bool hasIdImage = !string.IsNullOrEmpty(user.IdVerificationImage);

            return Ok(new { HasIdVerificationImage = hasIdImage });
        }

        [HttpPost("uploadIdVerificationImage")]
        [Authorize]
        public async Task<IActionResult> UploadIdVerificationImage(IFormFile file)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }

            var imageUrl = await _s3Service.ProcessIdVerificationImageAsync(file);

            if (!string.IsNullOrEmpty(user?.IdVerificationImage))
            {
                // 既存の画像をS3から削除
                var existingImageFileName = Path.GetFileName(user.IdVerificationImage);
                await _s3Service.DeleteFileFromS3Async(existingImageFileName, "IdVerificationBucketName");
            }

            if (!string.IsNullOrEmpty(imageUrl))
            {
                user.IdVerificationImage = imageUrl;
                await _context.SaveChangesAsync();
                return Ok(new { ImageUrl = imageUrl });
            }

            return BadRequest("Failed to process image.");
        }

        [HttpGet("GetUserProfile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }

            var userProfile = new
            {
                NickName = user.NickName,
                ProfileIcon = user.ProfileIcon
            };

            return Ok(userProfile);
        }

        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] string? nickName, [FromForm] IFormFile? profileIcon)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(nickName))
            {
                user.NickName = nickName;
            }

            if (profileIcon != null && profileIcon.Length > 0)
            {
                // 古い画像のURLを保持
                var oldImageUrl = user.ProfileIcon;

                // 新しい画像をS3にアップロード
                var imageUrl = await _s3Service.ProcessMangaImageAsync(profileIcon);
                user.ProfileIcon = imageUrl;

                // ユーザー情報を更新
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                // 古い画像をS3から削除
                if (!string.IsNullOrEmpty(oldImageUrl))
                {
                    var fileName = Path.GetFileName(new Uri(oldImageUrl).LocalPath);
                    await _s3Service.DeleteFileFromS3Async(fileName, "manga-img-bucket");
                }

                return Ok();
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult.Errors);
            }

            return Ok();
        }

        [HttpGet("protected")]
        [Authorize]
        public IActionResult Protected()
        {
            return Ok("Success!");
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(Request.Cookies["accessToken"]);
        }
    }
}
