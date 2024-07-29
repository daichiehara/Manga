using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddReportType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_Sell_SellId",
                table: "Report");

            migrationBuilder.AlterColumn<int>(
                name: "SellId",
                table: "Report",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "ReplyId",
                table: "Report",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReportType",
                table: "Report",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "Reply",
                type: "character varying(400)",
                maxLength: 400,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.CreateIndex(
                name: "IX_Report_ReplyId",
                table: "Report",
                column: "ReplyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Reply_ReplyId",
                table: "Report",
                column: "ReplyId",
                principalTable: "Reply",
                principalColumn: "ReplyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Sell_SellId",
                table: "Report",
                column: "SellId",
                principalTable: "Sell",
                principalColumn: "SellId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_Reply_ReplyId",
                table: "Report");

            migrationBuilder.DropForeignKey(
                name: "FK_Report_Sell_SellId",
                table: "Report");

            migrationBuilder.DropIndex(
                name: "IX_Report_ReplyId",
                table: "Report");

            migrationBuilder.DropColumn(
                name: "ReplyId",
                table: "Report");

            migrationBuilder.DropColumn(
                name: "ReportType",
                table: "Report");

            migrationBuilder.AlterColumn<int>(
                name: "SellId",
                table: "Report",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "Reply",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(400)",
                oldMaxLength: 400);

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Sell_SellId",
                table: "Report",
                column: "SellId",
                principalTable: "Sell",
                principalColumn: "SellId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
