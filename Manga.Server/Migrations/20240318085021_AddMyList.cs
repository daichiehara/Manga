using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Manga.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddMyList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "SellImage",
                newName: "SellImageId");

            migrationBuilder.CreateTable(
                name: "MyList",
                columns: table => new
                {
                    MyListId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserAccountId = table.Column<string>(type: "text", nullable: false),
                    SellId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyList", x => x.MyListId);
                    table.ForeignKey(
                        name: "FK_MyList_AspNetUsers_UserAccountId",
                        column: x => x.UserAccountId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MyList_Sell_SellId",
                        column: x => x.SellId,
                        principalTable: "Sell",
                        principalColumn: "SellId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MyList_SellId",
                table: "MyList",
                column: "SellId");

            migrationBuilder.CreateIndex(
                name: "IX_MyList_UserAccountId",
                table: "MyList",
                column: "UserAccountId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MyList");

            migrationBuilder.RenameColumn(
                name: "SellImageId",
                table: "SellImage",
                newName: "Id");
        }
    }
}
