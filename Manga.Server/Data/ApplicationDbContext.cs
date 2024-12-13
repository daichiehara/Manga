using System;
using System.Collections.Generic;
using Manga.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Manga.Server.Data;

public partial class ApplicationDbContext : IdentityDbContext<UserAccount>
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Sell> Sell { get; set; }
    public virtual DbSet<OwnedList> OwnedList { get; set; }
    public virtual DbSet<WishList> WishList { get; set; }
    public virtual DbSet<SellImage> SellImage { get; set; }
    public virtual DbSet<Reply> Reply { get; set; }
    public virtual DbSet<Report> Report { get; set; }
    public virtual DbSet<Request> Request { get; set; }
    public virtual DbSet<MyList> MyList { get; set; }
    public virtual DbSet<Notification> Notification { get; set; }
    public virtual DbSet<Match> Match { get; set; }
    public virtual DbSet<Contact> Contact { get; set; }
    public virtual DbSet<MangaTitle> MangaTitles { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);  // この行が重要です
        
        modelBuilder.Entity<MangaTitle>(entity =>
        {
            entity.ToTable("manga_titles", t => t.ExcludeFromMigrations());
            entity.HasKey(e => e.Id).HasName("manga_titles_pkey");

            entity.ToTable("manga_titles");

            entity.HasIndex(e => e.MainTitle, "manga_titles_main_title_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Author).HasColumnName("author");
            entity.Property(e => e.MainTitle).HasColumnName("main_title");
            entity.Property(e => e.YomiTitle).HasColumnName("yomi_title");
        });

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.Sell)
            .WithMany()
            .HasForeignKey(n => n.SellId)
            .OnDelete(DeleteBehavior.Cascade);

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
