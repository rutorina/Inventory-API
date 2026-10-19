using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventory.Api.DataMigrations
{
    /// <inheritdoc />
    public partial class StockLevelConcurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "StockLevels",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "xmin",
                table: "StockLevels");
        }
    }
}
