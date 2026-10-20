using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public record ReceiveStockLevelDto(
    [Required] int ItemId,
    [Required] int LocationId,
    [Required] [Range(1, int.MaxValue)] int Quantity
);
