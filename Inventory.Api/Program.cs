using Inventory.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
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
