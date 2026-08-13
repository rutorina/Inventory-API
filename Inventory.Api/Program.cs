using Inventory.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();
builder.AddInventoryDb();

builder.Services.AddValidation();

var app = builder.Build();



app.MapItemsEndpoints();
app.MapLocationsEndpoints();
app.MapStockLevelsEndpoints();

app.MigrateDb();

app.Run();
