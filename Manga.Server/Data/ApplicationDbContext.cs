using Manga.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.EntityFrameworkCore;
using System.Net.Sockets;

namespace Manga.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<UserAccount>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Sell>? Sell { get; set; }
        public DbSet<OwnedList>? OwnedList { get; set; }
        public DbSet<WishList>? WishList { get; set; }
        public DbSet<SellImage>? SellImage { get; set; }
        public DbSet<Reply>? Reply { get; set; }
        public DbSet<Report>? Report { get; set; }
        public DbSet<Request>? Request { get; set; }
        public DbSet<MyList>? MyList { get; set; }
        public DbSet<Notification>? Notification { get; set; }
    }
}
