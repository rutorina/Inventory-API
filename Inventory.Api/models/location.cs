using Microsoft.EntityFrameworkCore;

namespace Inventory.Api.Models;

[Index(nameof(Code), IsUnique = true)]
public class Location
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Code { get; set; }
}
