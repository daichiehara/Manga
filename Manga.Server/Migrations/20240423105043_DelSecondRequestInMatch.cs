using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class DelSecondRequestInMatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Match_Request_FirstRequestId",
                table: "Match");

            migrationBuilder.DropForeignKey(
                name: "FK_Match_Request_SecondRequestId",
                table: "Match");

            migrationBuilder.DropIndex(
                name: "IX_Match_FirstRequestId",
                table: "Match");

            migrationBuilder.DropColumn(
                name: "FirstRequestId",
                table: "Match");

            migrationBuilder.RenameColumn(
                name: "SecondRequestId",
                table: "Match",
                newName: "RequestId");

            migrationBuilder.RenameIndex(
                name: "IX_Match_SecondRequestId",
                table: "Match",
                newName: "IX_Match_RequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Match_Request_RequestId",
                table: "Match",
                column: "RequestId",
                principalTable: "Request",
                principalColumn: "RequestId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Match_Request_RequestId",
                table: "Match");

            migrationBuilder.RenameColumn(
                name: "RequestId",
                table: "Match",
                newName: "SecondRequestId");

            migrationBuilder.RenameIndex(
                name: "IX_Match_RequestId",
                table: "Match",
                newName: "IX_Match_SecondRequestId");

            migrationBuilder.AddColumn<int>(
                name: "FirstRequestId",
                table: "Match",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Match_FirstRequestId",
                table: "Match",
                column: "FirstRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Match_Request_FirstRequestId",
                table: "Match",
                column: "FirstRequestId",
                principalTable: "Request",
                principalColumn: "RequestId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Match_Request_SecondRequestId",
                table: "Match",
                column: "SecondRequestId",
                principalTable: "Request",
                principalColumn: "RequestId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
