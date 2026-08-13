using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Endpoints;

public static class StockLevelsEndpoints
{
    const string GetStockLevelEndpointName = "GetStockLevel";

    public static void MapStockLevelsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/stocklevels");
        // StockLevels get

        group.MapGet(
            "/",
            async (InventoryContext dbContext) =>
                await dbContext
                    .StockLevels.Include(sl => sl.Item)
                    .Include(sl => sl.Location)
                    .Select(sl => new StockLevelSummaryDto(
                        sl.Id,
                        sl.Item.Name,
                        sl.Location.Name,
                        sl.Quantity
                    ))
                    .AsNoTracking()
                    .ToListAsync()
        );

        // StockLevels get by id

        group.MapGet(
            "/{id}",
            async (int id, InventoryContext dbContext) =>
            {
                var stockLevel = await dbContext
                    .StockLevels.Include(sl => sl.Item)
                    .Include(sl => sl.Location)
                    .FirstOrDefaultAsync(sl => sl.Id == id);
                return stockLevel is not null
                    ? Results.Ok(new StockLevelSummaryDto(
                        stockLevel.Id,
                        stockLevel.Item.Name,
                        stockLevel.Location.Name,
                        stockLevel.Quantity
                    ))
                    : Results.NotFound();
            }
        ).WithName(GetStockLevelEndpointName);

        // StockLevels get by item id

        group.MapGet(
            "/item/{itemId}",
            async (int itemId, InventoryContext dbContext) =>
            {
                var result = await dbContext
                    .StockLevels.Include(sl => sl.Item)
                    .Include(sl => sl.Location)
                    .Where(sl => sl.ItemId == itemId)
                    .Select(sl => new StockLevelSummaryDto(
                        sl.Id,
                        sl.Item.Name,
                        sl.Location.Name,
                        sl.Quantity
                    ))
                    .ToListAsync();
                return result.Any() ? Results.Ok(result) : Results.NotFound();
            }
        );

        // // StockLevels get by location id

        group.MapGet(
            "/location/{locationId}",
            async (int locationId, InventoryContext dbContext) =>
            {
                var result = await dbContext
                    .StockLevels.Include(sl => sl.Item)
                    .Include(sl => sl.Location)
                    .Where(sl => sl.LocationId == locationId)
                    .Select(sl => new StockLevelSummaryDto(
                        sl.Id,
                        sl.Item.Name,
                        sl.Location.Name,
                        sl.Quantity
                    ))
                    .ToListAsync();
                return result.Any() ? Results.Ok(result) : Results.NotFound();
            }
        );

        // StockLevels post

        group.MapPost(
            "/",
            async (StockLevel newStockLevel, InventoryContext dbContext) =>
            {
                StockLevel stockLevel = new StockLevel
                {
                    ItemId = newStockLevel.ItemId,
                    LocationId = newStockLevel.LocationId,
                    Quantity = newStockLevel.Quantity,
                };
                dbContext.StockLevels.Add(stockLevel);
                await dbContext.SaveChangesAsync();

                StockLevelDto stockLevelDetail = new StockLevelDto(
                    stockLevel.ItemId,
                    stockLevel.LocationId,
                    stockLevel.Quantity
                );
                return Results.CreatedAtRoute(
                    "GetStockLevel",
                    new { id = stockLevel.Id },
                    stockLevelDetail
                );
            }
        );

        // StockLevels put

        group.MapPut(
            "/{id}",
            async (int id, StockLevel updatedStockLevel, InventoryContext dbContext) =>
            {
                var stockLevel = await dbContext.StockLevels.FirstOrDefaultAsync(sl => sl.Id == id);
                if (stockLevel is null)
                {
                    return Results.NotFound();
                }
                stockLevel.ItemId = updatedStockLevel.ItemId;
                stockLevel.LocationId = updatedStockLevel.LocationId;
                stockLevel.Quantity = updatedStockLevel.Quantity;
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            }
        );

        // StockLevels delete

        group.MapDelete(
            "/stocklevels/{id}",
            async (int id, InventoryContext dbContext) =>
            {
                var stockLevel = await dbContext.StockLevels.FirstOrDefaultAsync(sl => sl.Id == id);
                if (stockLevel is null)
                {
                    return Results.NotFound();
                }

                dbContext.StockLevels.Remove(stockLevel);
                await dbContext.SaveChangesAsync();
                return Results.NoContent();
            }
        );
    }
}
