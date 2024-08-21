using Amazon.SecretsManager.Model;
using Amazon.SecretsManager;
using Manga.Server;
using Manga.Server.Data;
using Manga.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json;
using Amazon.Extensions.NETCore.Setup;
using Microsoft.AspNetCore.Identity.UI.Services;
using Google.Api;

var builder = WebApplication.CreateBuilder(args);

static async Task<string> GetApiKeyFromAWSSecretsManager(string keyName)
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

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSingleton<IEmailSender, AmazonSESEmailSender>(provider =>
    new AmazonSESEmailSender("support@changey.net", "Changey"));

builder.Services.AddSingleton<S3Service>();


// CORS�I���W���ݒ�
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("https://localhost:5173", "https://localhost:7103")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddSwaggerGen(option => { option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { In = ParameterLocation.Header, Description = "Please enter a valid token", Name = "Authorization", Type = SecuritySchemeType.Http, BearerFormat = "JWT", Scheme = "Bearer" }); option.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new string[] { } } }); });
builder.Services.AddSwaggerGen(option => {
    // Bearer�F�؃X�L�[�����`
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header, // �g�[�N���̓w�b�_�[�ő��M
        Description = "Please enter a valid token", // Swagger UI�ɕ\����������
        Name = "Authorization", // �w�b�_�[�̖��O
        Type = SecuritySchemeType.Http, // �F�؃X�L�[���̃^�C�v
        BearerFormat = "JWT", // �g�[�N���̃t�H�[�}�b�g
        Scheme = "Bearer" // �X�L�[����
    });

    // ��`����Bearer�F�؃X�L�[����v���Ƃ��Ēǉ�
    option.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer" // SecurityDefinition�Œ�`�����X�L�[��ID
                }
            }, new string[] { }
        }
    });
});


builder.Services.AddIdentityApiEndpoints<UserAccount>(options =>
{
    // �p�X���[�h�̕��G���v��
    options.Password.RequireDigit = true; // ���������Ȃ��Ƃ�1�܂܂�Ă���K�v������
    options.Password.RequiredLength = 8; // �p�X���[�h�̍ŏ���
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true; // ���[�U�[�̃��[���A�h���X����ӂł��邱��
    options.SignIn.RequireConfirmedEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddErrorDescriber<IdentityErrorDescriberJP>();

// Add services to the container.
string? connectionString = builder.Configuration.GetConnectionString("ApplicationDbContext");


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();


/*
builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole();
    // ���̃��M���O�v���o�C�_�[��ǉ����邱�Ƃ��ł��܂�
});
*/

// クライアントIDとクライアントシークレットを事前に取得
var clientId = await GetApiKeyFromAWSSecretsManager("Google_ClientId");
var clientSecret = await GetApiKeyFromAWSSecretsManager("Google_ClientSecret");

builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JWT_OR_GOOGLE";
    options.DefaultChallengeScheme = "JWT_OR_GOOGLE";
})
.AddJwtBearer("JWT", options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
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

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // リクエストのCookieからトークンを取得
            context.Token = context.Request.Cookies["accessToken"];
            return Task.CompletedTask;
        }
    };
})
.AddGoogle("Google", googleOptions =>
{
    googleOptions.ClientId = clientId;
    googleOptions.ClientSecret = clientSecret;
    googleOptions.SaveTokens = true;
})
.AddPolicyScheme("JWT_OR_GOOGLE", "JWT or Google", options =>
{
    options.ForwardDefaultSelector = context =>
    {
        // Google認証用のパスを追加
        if (context.Request.Path.StartsWithSegments("/api/Users/auth/google"))
        {
            return "Google";
        }
        return "JWT";
    };
});


builder.Services.AddHttpClient();

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
app.UseRouting();

// CORS
app.UseCors("AllowSpecificOrigins");

//�t�ɂ��Ă͂Ȃ�Ȃ��B
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.MapIdentityApi<UserAccount>();

/*
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "confirmEmail",
        pattern: "api/Users/ConfirmNewEmail/{userId}/{code}/{changedEmail}");
});
*/

app.Run();
