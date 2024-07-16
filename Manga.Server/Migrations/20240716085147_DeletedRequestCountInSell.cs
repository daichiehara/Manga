using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class DeletedRequestCountInSell : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedRequesterSellCount",
                table: "Request");

            migrationBuilder.AddColumn<int>(
                name: "DeletedRequestCount",
                table: "Sell",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedRequestCount",
                table: "Sell");

            migrationBuilder.AddColumn<int>(
                name: "DeletedRequesterSellCount",
                table: "Request",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
