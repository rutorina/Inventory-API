using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public record UpdateStockLevelDto([Required] [Range(0, int.MaxValue)] int Quantity);
