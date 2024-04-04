using Manga.Server;
using Manga.Server.Data;
using Manga.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

// CORSオリジン設定
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()   // すべてのオリジンからのアクセスを許可
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddSwaggerGen(option => { option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { In = ParameterLocation.Header, Description = "Please enter a valid token", Name = "Authorization", Type = SecuritySchemeType.Http, BearerFormat = "JWT", Scheme = "Bearer" }); option.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new string[] { } } }); });
builder.Services.AddSwaggerGen(option => {
    // Bearer認証スキームを定義
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header, // トークンはヘッダーで送信
        Description = "Please enter a valid token", // Swagger UIに表示される説明
        Name = "Authorization", // ヘッダーの名前
        Type = SecuritySchemeType.Http, // 認証スキームのタイプ
        BearerFormat = "JWT", // トークンのフォーマット
        Scheme = "Bearer" // スキーム名
    });

    // 定義したBearer認証スキームを要件として追加
    option.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer" // SecurityDefinitionで定義したスキームID
                }
            }, new string[] { }
        }
    });
});

// Add services to the container.
string? connectionString = builder.Configuration.GetConnectionString("ApplicationDbContext");


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

/*
builder.Services.AddDefaultIdentity<UserAccount>(options =>
{
    // パスワードの複雑さ要件
    options.Password.RequireDigit = true; // 数字が少なくとも1つ含まれている必要がある
    options.Password.RequiredLength = 6; // パスワードの最小長
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true; // ユーザーのメールアドレスが一意であること
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddErrorDescriber<IdentityErrorDescriberJP>();
*/

builder.Services.AddIdentityApiEndpoints<UserAccount>(options =>
{
    // パスワードの複雑さ要件
    options.Password.RequireDigit = true; // 数字が少なくとも1つ含まれている必要がある
    options.Password.RequiredLength = 6; // パスワードの最小長
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true; // ユーザーのメールアドレスが一意であること
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddErrorDescriber<IdentityErrorDescriberJP>();

builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole();
    // 他のロギングプロバイダーを追加することもできます
});


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"]))
    };
    options.EventsType = typeof(CustomJwtBearerEvents);
});

builder.Services.AddTransient<CustomJwtBearerEvents>();

builder.Services.AddHttpClient();


/*
builder.Services.AddIdentityApiEndpoints<UserAccount>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentity<UserAccount, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddIdentityApiEndpoints<UserAccount>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
*/


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//逆にしてはならない。
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.MapIdentityApi<UserAccount>();

// CORS ミドルウェアを有効にする
app.UseCors("AllowAll");

app.Run();
