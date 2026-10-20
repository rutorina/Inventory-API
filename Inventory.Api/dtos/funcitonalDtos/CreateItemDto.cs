using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public record CreateItemDto(
    [Required] string Name,
    [Required] string Sku,
    string? Description
);
