namespace Inventory.Api.Models;

public record StockLevelSummaryDto(int id, int ItemId, int LocationId, string ItemName, string LocationName, int Quantity);
