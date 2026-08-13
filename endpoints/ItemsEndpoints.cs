using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Endpoints;

public static class ItemsEndpoints
{
    const string GetItemEndpointName = "GetItem";

    public static void MapItemsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/items");

        // Items get

        group.MapGet(
            "/",
            async (InventoryContext dbContext) =>
                await dbContext
                    .Items.Select(Item => new ItemDto(
                        Item.Id,
                        Item.Name,
                        Item.Sku,
                        Item.Description
                    ))
                    .AsNoTracking()
                    .ToListAsync()
        );

        // Items get by id

        group.MapGet(
            "/{id}",
            async (int id, InventoryContext dbContext) =>
            {
                var item = await dbContext.Items.FindAsync(id);
                return item is not null
                    ? Results.Ok(new ItemDto(item.Id, item.Name, item.Sku, item.Description))
                    : Results.NotFound();
            }
        ).WithName(GetItemEndpointName);

        // Items post

        group.MapPost(
            "/",
            async (CreateItemDto newItem, InventoryContext dbContext) =>
            {
                Item item = new Item
                {                    
                    Name = newItem.Name,
                    Sku = newItem.Sku,
                    Description = newItem.Description ?? string.Empty,
                };
                dbContext.Items.Add(item);
                await dbContext.SaveChangesAsync();

                return Results.CreatedAtRoute(GetItemEndpointName, new { id = item.Id }, item);
            }
        );

        // Items put

        group.MapPut(
            "/{id}",
            async (int id, CreateItemDto updatedItem, InventoryContext dbContext) =>
            {
                var item = await dbContext.Items.FindAsync(id);
                if (item is null)
                {
                    return Results.NotFound();
                }

                item.Name = updatedItem.Name;
                item.Sku = updatedItem.Sku;
                item.Description = updatedItem.Description ?? string.Empty;

                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            }
        );

        // Items delete

        group.MapDelete(
            "/{id}",
            async (int id, InventoryContext dbContext) =>
            {
                await dbContext.Items.Where(i => i.Id == id).ExecuteDeleteAsync();

                return Results.NoContent();
            }
        );
    }
}
