namespace Inventory.Api.Models;

public record StockLevelDto(int ItemId, int LocationId, int Quantity);
