using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Data;

public static class DataExtensions
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<InventoryContext>();
        db.Database.Migrate();
    }

    public static void AddInventoryDb(this WebApplicationBuilder builder)
    {
        var connString = builder.Configuration.GetConnectionString("DbConnection");
        if (connString is null)
        {
            throw new InvalidOperationException(
                "Connection string 'DbConnection' not found. Check your .env file."
            );
        }
        builder.Services.AddNpgsql<InventoryContext>(
            connString,
            optionsAction: options =>
                options.UseSeeding(
                    (context, _) =>
                    {
                        if (!context.Set<Item>().Any())
                        {
                            context
                                .Set<Item>()
                                .AddRange(
                                    new Item
                                    {
                                        Name = "Item 1",
                                        Sku = "SKU001",
                                        Description = "Description for Item 1",
                                    },
                                    new Item
                                    {
                                        Name = "Item 2",
                                        Sku = "SKU002",
                                        Description = "Description for Item 2",
                                    },
                                    new Item
                                    {
                                        Name = "Item 3",
                                        Sku = "SKU003",
                                        Description = "Description for Item 3",
                                    }
                                );
                            context.SaveChanges();
                        }
                        if (!context.Set<Location>().Any())
                        {
                            context
                                .Set<Location>()
                                .AddRange(
                                    new Location { Name = "Location 1", Code = "LOC001" },
                                    new Location { Name = "Location 2", Code = "LOC002" },
                                    new Location { Name = "Location 3", Code = "LOC003" }
                                );
                            context.SaveChanges();
                        }
                        if (!context.Set<StockLevel>().Any())
                        {
                            // Look up the real IDs; Postgres assigns them, so they aren't always 1, 2, 3
                            var itemIds = context
                                .Set<Item>()
                                .Where(i => new[] { "SKU001", "SKU002", "SKU003" }.Contains(i.Sku))
                                .ToDictionary(i => i.Sku, i => i.Id);
                            var locationIds = context
                                .Set<Location>()
                                .Where(l => new[] { "LOC001", "LOC002", "LOC003" }.Contains(l.Code))
                                .ToDictionary(l => l.Code, l => l.Id);

                            // Skip if the seed items or locations were deleted or changed
                            if (itemIds.Count < 3 || locationIds.Count < 3)
                            {
                                return;
                            }

                            context
                                .Set<StockLevel>()
                                .AddRange(
                                    new StockLevel
                                    {
                                        ItemId = itemIds["SKU001"],
                                        LocationId = locationIds["LOC001"],
                                        Quantity = 100,
                                    },
                                    new StockLevel
                                    {
                                        ItemId = itemIds["SKU002"],
                                        LocationId = locationIds["LOC002"],
                                        Quantity = 200,
                                    },
                                    new StockLevel
                                    {
                                        ItemId = itemIds["SKU003"],
                                        LocationId = locationIds["LOC003"],
                                        Quantity = 300,
                                    },
                                    new StockLevel
                                    {
                                        ItemId = itemIds["SKU001"],
                                        LocationId = locationIds["LOC002"],
                                        Quantity = 150,
                                    }
                                );
                            context.SaveChanges();
                        }
                    }
                )
        );
    }
}
