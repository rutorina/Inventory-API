namespace Inventory.Api.Models;

public class Item
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Sku { get; set; }
    public string Description { get; set; } = string.Empty;
}
