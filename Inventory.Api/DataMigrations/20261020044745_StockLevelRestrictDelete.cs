using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventory.Api.DataMigrations
{
    /// <inheritdoc />
    public partial class StockLevelRestrictDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockLevels_Items_ItemId",
                table: "StockLevels");

            migrationBuilder.DropForeignKey(
                name: "FK_StockLevels_Locations_LocationId",
                table: "StockLevels");

            migrationBuilder.AddForeignKey(
                name: "FK_StockLevels_Items_ItemId",
                table: "StockLevels",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StockLevels_Locations_LocationId",
                table: "StockLevels",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockLevels_Items_ItemId",
                table: "StockLevels");

            migrationBuilder.DropForeignKey(
                name: "FK_StockLevels_Locations_LocationId",
                table: "StockLevels");

            migrationBuilder.AddForeignKey(
                name: "FK_StockLevels_Items_ItemId",
                table: "StockLevels",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StockLevels_Locations_LocationId",
                table: "StockLevels",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
