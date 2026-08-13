using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public record CreateStockLevelDto(
    [Required] int ItemId,
    [Required] int LocationId,
    [Required] int Quantity
);
