# Builds the Inventory API. Build context is the repo root.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore first so the package layer is cached between code changes
COPY Inventory.Api/Inventory.Api.csproj Inventory.Api/
RUN dotnet restore Inventory.Api/Inventory.Api.csproj

COPY Inventory.Api/ Inventory.Api/
RUN dotnet publish Inventory.Api/Inventory.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
USER $APP_UID
EXPOSE 8080

# Render sets PORT; fall back to 8080 elsewhere
CMD ["sh", "-c", "exec dotnet Inventory.Api.dll --urls http://0.0.0.0:${PORT:-8080}"]
