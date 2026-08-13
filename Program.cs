using Inventory.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();
builder.AddInventoryDb();

var app = builder.Build();


app.MapItemsEndpoints();
app.MapLocationsEndpoints();
app.MapStockLevelsEndpoints();

app.MigrateDb();

app.Run();
