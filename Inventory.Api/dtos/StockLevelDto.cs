namespace Inventory.Api.Models;

public record StockLevelDto(int Id, int ItemId, int LocationId, int Quantity);
