using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSeiMei : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Mei",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Sei",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Mei",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Sei",
                table: "AspNetUsers");
        }
    }
}
