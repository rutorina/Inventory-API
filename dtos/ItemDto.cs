namespace Inventory.Api.Models;

public record ItemDto(
    int Id,
    string Name,
    string Sku,
    string Description
);
