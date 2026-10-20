using System.ComponentModel.DataAnnotations;

namespace Inventory.Api.Models;

public record CreateLocationDto(
    [Required] string Name,
    [Required] string Code
);
