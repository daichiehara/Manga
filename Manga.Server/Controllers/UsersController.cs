using Azure.Core;
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

        public UsersController(ApplicationDbContext context, UserManager<UserAccount> userManager, SignInManager<UserAccount> signInManager, IConfiguration configuration, IEmailSender emailSender)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailSender = emailSender;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var user = new UserAccount()
            {
                Email = model.Email,
                UserName = model.Email,
                NickName = model.NickName,
                PasswordHash = model.Password
            };

            var result = await _userManager.CreateAsync(user, user.PasswordHash!);

            if (result.Succeeded)
            {
                // ユーザー登録が成功した場合、自動的にログイン
                await _signInManager.SignInAsync(user, isPersistent: false);

                // JWTトークンを生成
                var token = GenerateJwtToken(user);

                return Ok(new { Token = token });
            }
            else
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
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
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
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
            // HTTPリクエストのCookieからリフレッシュトークンを取得
            var refreshToken = Request.Cookies["RefreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Refresh token is required.");
            }

            // データベースからリフレッシュトークンを持つユーザーを検索
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return BadRequest("Invalid refresh token.");
            }
            // 新しいアクセストークンとリフレッシュトークンを生成
            var newAccessToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // トークン更新処理
            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateAsync(user);

            // アクセストークンをHTTP Only Cookieに設定
            var accessTokenCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                //SameSite = SameSiteMode.Strict, // 必要に応じて None に設定
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(30) // アクセストークンの有効期限
            };
            HttpContext.Response.Cookies.Append("accessToken", newAccessToken, accessTokenCookieOptions);

            // リフレッシュトークンを別のHTTP Only Cookieに設定
            var refreshTokenCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                //SameSite = SameSiteMode.Strict, // 必要に応じて None に設定
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(180) // リフレッシュトークンの有効期限
            };
            HttpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, refreshTokenCookieOptions);

            // トークンが正常に更新されたことをクライアントに通知
            return Ok(new { message = "トークンが正常に更新されました。" });
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
                PostalCode = user.PostalCode,
                Prefecture = user?.Prefecture,
                Address1 = user?.Address1,
                Address2 = user?.Address2
            };

            return Ok(addressDto);
        }

        [HttpPut("updateAddress")]
        [Authorize]
        public async Task<IActionResult> UpdateAddress(ChangeAddressDto model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }

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
