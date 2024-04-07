using Azure.Core;
using Manga.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.V4.Pages.Account.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Manga.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly SignInManager<UserAccount> _signInManager;
        private readonly IConfiguration _configuration;

        public UsersController(UserManager<UserAccount> userManager, SignInManager<UserAccount> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
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
                return Unauthorized(errorResponse);
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            // ユーザーアカウントにリフレッシュトークンを保存
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
            // データベースに変更を保存
            await _userManager.UpdateAsync(user);

            // アクセストークンをHTTP Only Cookieにセット
            SetTokenCookie("accessToken", token, 30); // 15分間有効

            // リフレッシュトークンを別のHTTP Only Cookieにセット
            SetTokenCookie("RefreshToken", refreshToken, 1440); // 1日間有効

            return Ok(new { AccessToken = token, RefreshToken = refreshToken });
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

        /*
        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] JwtDto request)
        {
            // リフレッシュトークンの検証
            var principal = GetPrincipalFromExpiredToken(request.AccessToken);
            var username = principal.Identity.Name; // アクセストークンからユーザー名を取得
            var user = await _userManager.FindByNameAsync(username);

            if (user == null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return BadRequest("Invalid client request");
            }

            var newAccessToken = GenerateJwtToken(user);
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            await _userManager.UpdateAsync(user);

            return new ObjectResult(new
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }
        */
        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken()
        {
            // HTTPリクエストのCookieからリフレッシュトークンを取得
            var accessToken = Request.Cookies["accessToken"];
            var refreshToken = Request.Cookies["RefreshToken"];
            // リフレッシュトークンの検証
            var principal = GetPrincipalFromExpiredToken(accessToken);
            var username = principal.Identity.Name; // アクセストークンからユーザー名を取得
            var user = await _userManager.FindByNameAsync(username);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return BadRequest("Invalid client request");
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
                Expires = DateTime.UtcNow.AddMinutes(15) // アクセストークンの有効期限
            };
            HttpContext.Response.Cookies.Append("accessToken", newAccessToken, accessTokenCookieOptions);

            // リフレッシュトークンを別のHTTP Only Cookieに設定
            var refreshTokenCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                //SameSite = SameSiteMode.Strict, // 必要に応じて None に設定
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(30) // リフレッシュトークンの有効期限
            };
            HttpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, refreshTokenCookieOptions);

            // トークンが正常に更新されたことをクライアントに通知
            return Ok(new { message = "トークンが正常に更新されました。" });
        }



        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, // アクセストークン失効時はオーディエンスの検証をスキップ
                ValidateIssuer = false, // アクセストークン失効時は発行者の検証をスキップ
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"])),
                ValidateLifetime = false // アクセストークンが失効していてもOK
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;

            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
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
