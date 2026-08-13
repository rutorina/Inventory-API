namespace Inventory.Api.Models;

public class Location
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Code { get; set; }
}
