using Inventory.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Data;

public class InventoryContext(DbContextOptions<InventoryContext> options) : DbContext(options)
{
    public DbSet<Item> Items => Set<Item>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<StockLevel> StockLevels => Set<StockLevel>();

    // Override the (bool, CancellationToken) overload; the other async overload forwards to it
    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default
    )
    {
        var emptied = ChangeTracker
            .Entries<StockLevel>()
            .Where(e => e.State == EntityState.Modified && e.Entity.Quantity == 0)
            .ToList();

        foreach (var entry in emptied)
        {
            entry.State = EntityState.Deleted;
        }

        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }
}
