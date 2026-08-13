namespace Inventory.Api.Models;

public class StockLevel
{
    public int Id { get; set; }
    public Item? Item { get; set; }
    public int ItemId { get; set; }
    public Location? Location { get; set; }
    public int LocationId { get; set; }

    public required int Quantity { get; set; }
}
