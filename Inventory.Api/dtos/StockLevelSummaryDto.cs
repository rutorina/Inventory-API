namespace Inventory.Api.Models;

public record StockLevelSummaryDto(int id, string ItemName, string LocationName, int Quantity);
