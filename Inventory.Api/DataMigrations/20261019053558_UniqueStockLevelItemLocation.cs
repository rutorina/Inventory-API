using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventory.Api.DataMigrations
{
    /// <inheritdoc />
    public partial class UniqueStockLevelItemLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StockLevels_ItemId",
                table: "StockLevels");

            migrationBuilder.CreateIndex(
                name: "IX_StockLevels_ItemId_LocationId",
                table: "StockLevels",
                columns: new[] { "ItemId", "LocationId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StockLevels_ItemId_LocationId",
                table: "StockLevels");

            migrationBuilder.CreateIndex(
                name: "IX_StockLevels_ItemId",
                table: "StockLevels",
                column: "ItemId");
        }
    }
}
