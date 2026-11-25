using Inventory.Api.Data;
using Inventory.Api.Endpoints;

// Load .env into environment variables before configuration is built
DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// Allowed frontend URLs: a JSON array in appsettings, or a comma-separated
// FrontendOrigins environment variable (e.g. on Render)
var frontendOrigins =
    builder.Configuration.GetSection("FrontendOrigins").Get<string[]>()
    ?? builder.Configuration["FrontendOrigins"]
        ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? [];

builder.Services.AddCors(options =>
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins(frontendOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()));
builder.Services.AddOpenApi();

builder.Services.AddValidation();

builder.AddInventoryDb();

var app = builder.Build();

app.UseCors("frontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.MapItemsEndpoints();
app.MapLocationsEndpoints();
app.MapStockLevelsEndpoints();

app.MigrateDb();

app.Run();
