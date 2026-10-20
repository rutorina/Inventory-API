using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public record TransferStockLevelDto(
    int ItemId,
    int FromLocationId,
    int ToLocationId,
    int Quantity
);
