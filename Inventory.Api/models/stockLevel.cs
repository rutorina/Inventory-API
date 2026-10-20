using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Models;

// One stock level row per item per location
[Index(nameof(ItemId), nameof(LocationId), IsUnique = true)]
public class StockLevel
{
    public int Id { get; set; }

    public int ItemId { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public Item? Item { get; set; }

    public int LocationId { get; set; }

    [DeleteBehavior(DeleteBehavior.Restrict)]
    public Location? Location { get; set; }

    public required int Quantity { get; set; }

    // Concurrency token: Npgsql maps this to Postgres's built-in xmin column
    [Timestamp]
    public uint Version { get; set; }
}
