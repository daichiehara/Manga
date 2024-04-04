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
                
                //return Unauthorized(new { error = "メールアドレスもしくはパスワードが間違っています。" });
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();
            // ユーザーアカウントにリフレッシュトークンを保存
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
            // データベースに変更を保存
            await _userManager.UpdateAsync(user);

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

        [HttpGet("protected")]
        [Authorize]
        public IActionResult Protected()
        {
            return Ok();
        }
    }
}
