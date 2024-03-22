using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddStateAndNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BookState",
                table: "Sell",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfBooks",
                table: "Sell",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookState",
                table: "Sell");

            migrationBuilder.DropColumn(
                name: "NumberOfBooks",
                table: "Sell");
        }
    }
}
