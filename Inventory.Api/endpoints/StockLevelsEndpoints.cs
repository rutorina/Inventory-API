using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Endpoints;

public static class StockLevelsEndpoints
{
    const string GetStockLevelEndpointName = "GetStockLevel";

    public static void MapStockLevelsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/stocklevels");
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

        group
            .MapGet(
                "/{id}",
                async (int id, InventoryContext dbContext) =>
                {
                    var stockLevel = await dbContext
                        .StockLevels.Include(sl => sl.Item)
                        .Include(sl => sl.Location)
                        .FirstOrDefaultAsync(sl => sl.Id == id);
                    return stockLevel is not null
                        ? Results.Ok(
                            new StockLevelSummaryDto(
                                stockLevel.Id,
                                stockLevel.Item.Name,
                                stockLevel.Location.Name,
                                stockLevel.Quantity
                            )
                        )
                        : Results.NotFound();
                }
            )
            .WithName(GetStockLevelEndpointName);

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
                return result.Any()
                    ? Results.Ok(result)
                    : Results.Ok(Array.Empty<StockLevelSummaryDto>());
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
                return result.Any()
                    ? Results.Ok(result)
                    : Results.Ok(Array.Empty<StockLevelSummaryDto>());
            }
        );

        // StockLevels post

        group.MapPost(
            "/receive",
            async (ReceiveStockLevelDto newStockLevel, InventoryContext dbContext) =>
            {
                if (newStockLevel.Quantity < 0)
                {
                    return Results.BadRequest("Quantity cannot be negative.");
                }
                if (!await dbContext.Items.AnyAsync(i => i.Id == newStockLevel.ItemId))
                {
                    return Results.BadRequest($"Item {newStockLevel.ItemId} does not exist.");
                }
                if (!await dbContext.Locations.AnyAsync(l => l.Id == newStockLevel.LocationId))
                {
                    return Results.BadRequest(
                        $"Location {newStockLevel.LocationId} does not exist."
                    );
                }
                var matchingStockLevel = dbContext.StockLevels.Where(sl =>
                    sl.ItemId == newStockLevel.ItemId && sl.LocationId == newStockLevel.LocationId
                );

                Task<int> AddToExistingAsync() =>
                    matchingStockLevel.ExecuteUpdateAsync(s =>
                        s.SetProperty(sl => sl.Quantity, sl => sl.Quantity + newStockLevel.Quantity)
                    );

                if (await AddToExistingAsync() == 0)
                {
                    dbContext.StockLevels.Add(
                        new StockLevel
                        {
                            ItemId = newStockLevel.ItemId,
                            LocationId = newStockLevel.LocationId,
                            Quantity = newStockLevel.Quantity,
                        }
                    );
                    try
                    {
                        await dbContext.SaveChangesAsync();
                    }
                    catch (DbUpdateException)
                    {
                        dbContext.ChangeTracker.Clear();
                        await AddToExistingAsync();
                    }
                }

                var stockLevel = await matchingStockLevel.AsNoTracking().FirstAsync();

                return Results.CreatedAtRoute(
                    GetStockLevelEndpointName,
                    new { id = stockLevel.Id },
                    new StockLevelDto(
                        stockLevel.Id,
                        stockLevel.ItemId,
                        stockLevel.LocationId,
                        stockLevel.Quantity
                    )
                );
            }
        );

        // StockLevels put

        group.MapPut(
            "/{id}",
            async (int id, ReceiveStockLevelDto updatedStockLevel, InventoryContext dbContext) =>
            {
                if (updatedStockLevel.Quantity < 0)
                {
                    return Results.BadRequest("Quantity must not be negative.");
                }
                var stockLevel = await dbContext.StockLevels.FirstOrDefaultAsync(sl => sl.Id == id);
                if (stockLevel is null)
                {
                    return Results.NotFound();
                }
                if (!await dbContext.Items.AnyAsync(i => i.Id == updatedStockLevel.ItemId))
                {
                    return Results.BadRequest($"Item {updatedStockLevel.ItemId} does not exist.");
                }
                if (!await dbContext.Locations.AnyAsync(l => l.Id == updatedStockLevel.LocationId))
                {
                    return Results.BadRequest(
                        $"Location {updatedStockLevel.LocationId} does not exist."
                    );
                }

                stockLevel.ItemId = updatedStockLevel.ItemId;
                stockLevel.LocationId = updatedStockLevel.LocationId;
                stockLevel.Quantity = updatedStockLevel.Quantity;
                try
                {
                    await dbContext.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    return Results.Conflict("Stock changed during update, please retry.");
                }

                return Results.NoContent();
            }
        );
        // StockLevels transfer

        group.MapPost(
            "/transfer",
            async (TransferStockLevelDto transferStockLevel, InventoryContext dbContext) =>
            {
                if (transferStockLevel.Quantity <= 0)
                {
                    return Results.BadRequest("Quantity must be greater than zero.");
                }
                if (transferStockLevel.FromLocationId == transferStockLevel.ToLocationId)
                {
                    return Results.BadRequest(
                        "Source and destination locations must be different."
                    );
                }

                var fromStockLevel = await dbContext.StockLevels.FirstOrDefaultAsync(sl =>
                    sl.ItemId == transferStockLevel.ItemId
                    && sl.LocationId == transferStockLevel.FromLocationId
                );
                if (fromStockLevel is null)
                {
                    return Results.BadRequest("Source location does not have the specified item.");
                }

                if (!await dbContext.Locations.AnyAsync(l => l.Id == transferStockLevel.ToLocationId))
                {
                    return Results.BadRequest("Destination location does not exist.");
                }

                var toStockLevel = await dbContext.StockLevels.FirstOrDefaultAsync(sl =>
                    sl.ItemId == transferStockLevel.ItemId
                    && sl.LocationId == transferStockLevel.ToLocationId
                );

                if (fromStockLevel.Quantity < transferStockLevel.Quantity)
                {
                    return Results.BadRequest("Insufficient stock at the source location.");
                }

                if (toStockLevel is null)
                {
                    toStockLevel = new StockLevel
                    {
                        ItemId = transferStockLevel.ItemId,
                        LocationId = transferStockLevel.ToLocationId,
                        Quantity = 0,
                    };
                    dbContext.StockLevels.Add(toStockLevel);
                }

                fromStockLevel.Quantity -= transferStockLevel.Quantity;
                toStockLevel.Quantity += transferStockLevel.Quantity;
                try
                {
                    await dbContext.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    return Results.Conflict("Stock changed during transfer, please retry.");
                }

                return Results.Ok();
            }
        );

        // StockLevels delete

        group.MapDelete(
            "/{id}",
            async (int id, InventoryContext dbContext) =>
            {
                await dbContext.StockLevels.Where(sl => sl.Id == id).ExecuteDeleteAsync();
                return Results.NoContent();
            }
        );
    }
}
