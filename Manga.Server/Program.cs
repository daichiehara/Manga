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

// CORS�I���W���ݒ�
builder.Services.AddCors(options =>
{
    /*
    options.AddPolicy(
        "AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()   // ���ׂẴI���W������̃A�N�Z�X������
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
    */
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

// Add services to the container.
string? connectionString = builder.Configuration.GetConnectionString("ApplicationDbContext");


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

/*
builder.Services.AddDefaultIdentity<UserAccount>(options =>
{
    // �p�X���[�h�̕��G���v��
    options.Password.RequireDigit = true; // ���������Ȃ��Ƃ�1�܂܂�Ă���K�v������
    options.Password.RequiredLength = 6; // �p�X���[�h�̍ŏ���
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true; // ���[�U�[�̃��[���A�h���X����ӂł��邱��
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddErrorDescriber<IdentityErrorDescriberJP>();
*/

builder.Services.AddIdentityApiEndpoints<UserAccount>(options =>
{
    // �p�X���[�h�̕��G���v��
    options.Password.RequireDigit = true; // ���������Ȃ��Ƃ�1�܂܂�Ă���K�v������
    options.Password.RequiredLength = 6; // �p�X���[�h�̍ŏ���
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true; // ���[�U�[�̃��[���A�h���X����ӂł��邱��
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddErrorDescriber<IdentityErrorDescriberJP>();

builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole();
    // ���̃��M���O�v���o�C�_�[��ǉ����邱�Ƃ��ł��܂�
});


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddCookie(x => 
{
    x.Cookie.Name = "AccessToken";
}).AddJwtBearer(options =>
{
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
    options.EventsType = typeof(CustomJwtBearerEvents);

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // リクエストのCookieからトークンを取得
            context.Token = context.Request.Cookies["AccessToken"];
            return Task.CompletedTask;
        }
    };
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

//�t�ɂ��Ă͂Ȃ�Ȃ��B
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.MapIdentityApi<UserAccount>();

// CORS �~�h���E�F�A��L���ɂ���
app.UseCors("AllowSpecificOrigins");

app.Run();
