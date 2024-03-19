using Manga.Server.Data;
using Manga.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
string? connectionString = builder.Configuration.GetConnectionString("ApplicationDbContext");


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();


builder.Services.AddDefaultIdentity<UserAccount>(options =>
{
    // パスワードの複雑さ要件
    options.Password.RequireDigit = true; // 数字が少なくとも1つ含まれている必要がある
    options.Password.RequiredLength = 6; // パスワードの最小長
    options.Password.RequireNonAlphanumeric = false;
    options.User.RequireUniqueEmail = true; // ユーザーのメールアドレスが一意であること
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>();


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

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.MapIdentityApi<UserAccount>();

app.Run();
