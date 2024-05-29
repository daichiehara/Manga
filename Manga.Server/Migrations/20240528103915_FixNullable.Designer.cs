﻿// <auto-generated />
using System;
using Manga.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Manga.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240528103915_FixNullable")]
    partial class FixNullable
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Manga.Server.Models.Contact", b =>
                {
                    b.Property<int>("ContactId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ContactId"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserAccountId")
                        .HasColumnType("text");

                    b.HasKey("ContactId");

                    b.HasIndex("UserAccountId");

                    b.ToTable("Contact");
                });

            modelBuilder.Entity("Manga.Server.Models.Match", b =>
                {
                    b.Property<int>("MatchId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("MatchId"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("RequestId")
                        .HasColumnType("integer");

                    b.HasKey("MatchId");

                    b.HasIndex("RequestId");

                    b.ToTable("Match");
                });

            modelBuilder.Entity("Manga.Server.Models.MyList", b =>
                {
                    b.Property<int>("MyListId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("MyListId"));

                    b.Property<int>("SellId")
                        .HasColumnType("integer");

                    b.Property<string>("UserAccountId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("MyListId");

                    b.HasIndex("SellId");

                    b.HasIndex("UserAccountId");

                    b.ToTable("MyList");
                });

            modelBuilder.Entity("Manga.Server.Models.Notification", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsRead")
                        .HasColumnType("boolean");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("SellId")
                        .HasColumnType("integer");

                    b.Property<int>("Type")
                        .HasColumnType("integer");

                    b.Property<DateTime>("UpdatedDateTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UserAccountId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("SellId");

                    b.HasIndex("UserAccountId");

                    b.ToTable("Notification");
                });

            modelBuilder.Entity("Manga.Server.Models.OwnedList", b =>
                {
                    b.Property<int>("OwnedListId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("OwnedListId"));

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserAccountId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("OwnedListId");

                    b.HasIndex("UserAccountId");

                    b.ToTable("OwnedList");
                });

            modelBuilder.Entity("Manga.Server.Models.Reply", b =>
                {
                    b.Property<int>("ReplyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ReplyId"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("boolean");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<int>("SellId")
                        .HasColumnType("integer");

                    b.Property<string>("UserAccountId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ReplyId");

                    b.HasIndex("SellId");

                    b.HasIndex("UserAccountId");

                    b.ToTable("Reply");
                });

            modelBuilder.Entity("Manga.Server.Models.Report", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("ReportId"));

                    b.Property<DateTime>("Created")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("SellId")
                        .HasColumnType("integer");

                    b.Property<string>("UserAccountId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("ReportId");

                    b.HasIndex("SellId");

                    b.HasIndex("UserAccountId");

                    b.ToTable("Report");
                });

            modelBuilder.Entity("Manga.Server.Models.Request", b =>
                {
                    b.Property<int>("RequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("RequestId"));

                    b.Property<DateTime>("Create")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("RequesterId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("RequesterSellId")
                        .HasColumnType("integer");

                    b.Property<string>("ResponderId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("ResponderSellId")
                        .HasColumnType("integer");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.HasKey("RequestId");

                    b.HasIndex("RequesterId");

                    b.HasIndex("RequesterSellId");

                    b.HasIndex("ResponderId");

                    b.HasIndex("ResponderSellId");

                    b.ToTable("Request");
                });

            modelBuilder.Entity("Manga.Server.Models.Sell", b =>
                {
                    b.Property<int>("SellId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("SellId"));

                    b.Property<int?>("BookState")
                        .HasColumnType("integer");

                    b.Property<int?>("NumberOfBooks")
                        .HasColumnType("integer");

                    b.Property<string>("SellMessage")
                        .HasColumnType("text");

                    b.Property<int>("SellStatus")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("SellTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("SendDay")
                        .HasColumnType("integer");

                    b.Property<int?>("SendPrefecture")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .HasColumnType("text");

                    b.Property<string>("UserAccountId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("SellId");

                    b.HasIndex("UserAccountId");

                    b.ToTable("Sell");
                });

            modelBuilder.Entity("Manga.Server.Models.SellImage", b =>
                {
                    b.Property<int>("SellImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("SellImageId"));

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Order")
                        .HasColumnType("integer");

                    b.Property<int>("SellId")
                        .HasColumnType("integer");

                    b.HasKey("SellImageId");

                    b.HasIndex("SellId");

                    b.ToTable("SellImage");
                });

            modelBuilder.Entity("Manga.Server.Models.UserAccount", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("Address1")
                        .HasColumnType("text");

                    b.Property<string>("Address2")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("IdVerificationImage")
                        .HasColumnType("text");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Mei")
                        .HasColumnType("text");

                    b.Property<string>("NickName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("PostalCode")
                        .HasColumnType("text");

                    b.Property<string>("Prefecture")
                        .HasColumnType("text");

                    b.Property<string>("ProfileIcon")
                        .HasColumnType("text");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("text");

                    b.Property<DateTime?>("RefreshTokenExpiryTime")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<string>("Sei")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Manga.Server.Models.WishList", b =>
                {
                    b.Property<int>("WishListId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("WishListId"));

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserAccountId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("WishListId");

                    b.HasIndex("UserAccountId");

                    b.ToTable("WishList");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("Manga.Server.Models.Contact", b =>
                {
                    b.HasOne("Manga.Server.Models.UserAccount", "UserAccount")
                        .WithMany("Contacts")
                        .HasForeignKey("UserAccountId");

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manga.Server.Models.Match", b =>
                {
                    b.HasOne("Manga.Server.Models.Request", "Request")
                        .WithMany()
                        .HasForeignKey("RequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Request");
                });

            modelBuilder.Entity("Manga.Server.Models.MyList", b =>
                {
                    b.HasOne("Manga.Server.Models.Sell", "Sell")
                        .WithMany("MyLists")
                        .HasForeignKey("SellId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manga.Server.Models.UserAccount", "UserAccount")
                        .WithMany("MyLists")
                        .HasForeignKey("UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Sell");

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manga.Server.Models.Notification", b =>
                {
                    b.HasOne("Manga.Server.Models.Sell", "Sell")
                        .WithMany()
                        .HasForeignKey("SellId");

                    b.HasOne("Manga.Server.Models.UserAccount", "UserAccount")
                        .WithMany("Notifications")
                        .HasForeignKey("UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Sell");

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manga.Server.Models.OwnedList", b =>
                {
                    b.HasOne("Manga.Server.Models.UserAccount", "UserAccount")
                        .WithMany("OwnedLists")
                        .HasForeignKey("UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manga.Server.Models.Reply", b =>
                {
                    b.HasOne("Manga.Server.Models.Sell", "Sell")
                        .WithMany("Replys")
                        .HasForeignKey("SellId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manga.Server.Models.UserAccount", "UserAccount")
                        .WithMany("Replys")
                        .HasForeignKey("UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Sell");

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manga.Server.Models.Report", b =>
                {
                    b.HasOne("Manga.Server.Models.Sell", "Sell")
                        .WithMany()
                        .HasForeignKey("SellId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manga.Server.Models.UserAccount", "UserAccount")
                        .WithMany()
                        .HasForeignKey("UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Sell");

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manga.Server.Models.Request", b =>
                {
                    b.HasOne("Manga.Server.Models.UserAccount", "Requester")
                        .WithMany()
                        .HasForeignKey("RequesterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manga.Server.Models.Sell", "RequesterSell")
                        .WithMany()
                        .HasForeignKey("RequesterSellId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manga.Server.Models.UserAccount", "Responder")
                        .WithMany()
                        .HasForeignKey("ResponderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manga.Server.Models.Sell", "ResponderSell")
                        .WithMany()
                        .HasForeignKey("ResponderSellId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Requester");

                    b.Navigation("RequesterSell");

                    b.Navigation("Responder");

                    b.Navigation("ResponderSell");
                });

            modelBuilder.Entity("Manga.Server.Models.Sell", b =>
                {
                    b.HasOne("Manga.Server.Models.UserAccount", "UserAccount")
                        .WithMany("Sells")
                        .HasForeignKey("UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Manga.Server.Models.SellImage", b =>
                {
                    b.HasOne("Manga.Server.Models.Sell", "Sell")
                        .WithMany("SellImages")
                        .HasForeignKey("SellId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Sell");
                });

            modelBuilder.Entity("Manga.Server.Models.WishList", b =>
                {
                    b.HasOne("Manga.Server.Models.UserAccount", "UserAccount")
                        .WithMany("WishLists")
                        .HasForeignKey("UserAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserAccount");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Manga.Server.Models.UserAccount", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Manga.Server.Models.UserAccount", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Manga.Server.Models.UserAccount", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Manga.Server.Models.UserAccount", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Manga.Server.Models.Sell", b =>
                {
                    b.Navigation("MyLists");

                    b.Navigation("Replys");

                    b.Navigation("SellImages");
                });

            modelBuilder.Entity("Manga.Server.Models.UserAccount", b =>
                {
                    b.Navigation("Contacts");

                    b.Navigation("MyLists");

                    b.Navigation("Notifications");

                    b.Navigation("OwnedLists");

                    b.Navigation("Replys");

                    b.Navigation("Sells");

                    b.Navigation("WishLists");
                });
#pragma warning restore 612, 618
        }
    }
}
