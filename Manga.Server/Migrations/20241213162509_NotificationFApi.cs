using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class NotificationFApi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Sell_SellId",
                table: "Notification");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Sell_SellId",
                table: "Notification",
                column: "SellId",
                principalTable: "Sell",
                principalColumn: "SellId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Sell_SellId",
                table: "Notification");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Sell_SellId",
                table: "Notification",
                column: "SellId",
                principalTable: "Sell",
                principalColumn: "SellId");
        }
    }
}
