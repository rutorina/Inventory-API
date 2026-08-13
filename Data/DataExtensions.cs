using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Endpoints;

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
        var connString = builder.Configuration.GetConnectionString("Inverntory");
        builder.Services.AddScoped<InventoryContext>();
        builder.Services.AddSqlite<InventoryContext>(
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
                                        Id = 1,
                                        Name = "Item 1",
                                        Sku = "SKU001",
                                        Description = "Description for Item 1",
                                    },
                                    new Item
                                    {
                                        Id = 2,
                                        Name = "Item 2",
                                        Sku = "SKU002",
                                        Description = "Description for Item 2",
                                    },
                                    new Item
                                    {
                                        Id = 3,
                                        Name = "Item 3",
                                        Sku = "SKU003",
                                        Description = "Description for Item 3",
                                    }
                                );
                            context.SaveChanges();
                        }
                    }
                )
        );
    }
}
