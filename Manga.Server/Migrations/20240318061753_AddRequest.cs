using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Request",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequesterId = table.Column<string>(type: "text", nullable: false),
                    RequesterSellId = table.Column<int>(type: "integer", nullable: false),
                    ResponderId = table.Column<string>(type: "text", nullable: false),
                    ResponderSellId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Create = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Request", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_Request_AspNetUsers_RequesterId",
                        column: x => x.RequesterId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Request_AspNetUsers_ResponderId",
                        column: x => x.ResponderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Request_Sell_RequesterSellId",
                        column: x => x.RequesterSellId,
                        principalTable: "Sell",
                        principalColumn: "SellId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Request_Sell_ResponderSellId",
                        column: x => x.ResponderSellId,
                        principalTable: "Sell",
                        principalColumn: "SellId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Request_RequesterId",
                table: "Request",
                column: "RequesterId");

            migrationBuilder.CreateIndex(
                name: "IX_Request_RequesterSellId",
                table: "Request",
                column: "RequesterSellId");

            migrationBuilder.CreateIndex(
                name: "IX_Request_ResponderId",
                table: "Request",
                column: "ResponderId");

            migrationBuilder.CreateIndex(
                name: "IX_Request_ResponderSellId",
                table: "Request",
                column: "ResponderSellId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Request");
        }
    }
}
