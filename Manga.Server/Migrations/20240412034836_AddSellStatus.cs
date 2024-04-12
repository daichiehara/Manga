using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSellStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SellStatus",
                table: "Sell",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SellStatus",
                table: "Sell");
        }
    }
}
