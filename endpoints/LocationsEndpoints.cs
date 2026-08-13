using Inventory.Api.Data;
using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Endpoints;

public static class LocationsEndpoints
{
    const string GetLocationEndpointName = "GetLocation";

    public static void MapLocationsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/locations");

        // Locations get

        group.MapGet(
            "/",
            async (InventoryContext db) =>
                await db
                    .Locations.Select(location => new LocationDto(
                        location.Id,
                        location.Name,
                        location.Code
                    ))
                    .AsNoTracking()
                    .ToListAsync()
        );

        // Locations get by id

        group.MapGet(
            "/{id}",
            async (int id, InventoryContext db) =>
            {
                var location = await db.Locations.FindAsync(id);
                return location is not null
                    ? Results.Ok(new LocationDto(location.Id, location.Name, location.Code))
                    : Results.NotFound();
            }
        ).WithName(GetLocationEndpointName);

        // Locations post

        group.MapPost(
            "/",
            async (CreateLocationDto newLocation, InventoryContext db) =>
            {
                var location = new Location
                {
                    Name = newLocation.Name,
                    Code = newLocation.Code,
                };
                db.Locations.Add(location);
                await db.SaveChangesAsync();

                return Results.CreatedAtRoute(GetLocationEndpointName, new { id = location.Id }, location);
            }
        );

        // Locations put

        group.MapPut(
            "/{id}",
            async (int id, CreateLocationDto updatedLocation, InventoryContext db) =>
            {
                var location = await db.Locations.FindAsync(id);
                if (location is null)
                {
                    return Results.NotFound();
                }

                location.Name = updatedLocation.Name;
                location.Code = updatedLocation.Code;

                await db.SaveChangesAsync();

                return Results.NoContent();
            }
        );

        // Locations delete

        group.MapDelete(
            "/{id}",
            async (int id, InventoryContext db) =>
            {
                var location = await db.Locations.FindAsync(id);
                if (location is null)
                {
                    return Results.NotFound();
                }

                db.Locations.Remove(location);
                await db.SaveChangesAsync();
                return Results.NoContent();
            }
        );
    }
}
