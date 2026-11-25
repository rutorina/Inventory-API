# RutInventory

A small inventory management app: keep a catalogue of **items**, a list of **locations** (warehouses, shelves, …), and track how much of each item is stored where.

- **Backend:** ASP.NET Core minimal API (.NET 10) + Entity Framework Core + PostgreSQL
- **Frontend:** React 19 + React Router + Tailwind CSS v4, built with Vite

## Features

- **Items:** list, add, view, edit and delete items (name, SKU, description)
- **Locations:** list, add, view, edit and delete locations (name, code)
- **Receive stock:** book incoming stock of an item into a location
- **Transfer stock:** move stock between locations. Only locations that hold the item can be the source, and you can't move more than is there.
- **Stock levels:** an overview of every item's quantity per location
- Item pages show which locations hold the item, and location pages show which items they hold.
- Loading placeholders, inline error messages with retry, and a 404 page

Business rules are enforced by the API:
- SKUs and location codes are unique.
- There is one stock level per item per location.
- Quantities must be positive.
- Items and locations that still have stock can't be deleted.

## Project structure

```
Inventory-API/
├── Inventory.Api/          ASP.NET Core API
│   ├── Program.cs          app setup, CORS, endpoint registration
│   ├── Data/               DbContext, seeding, auto-migration
│   ├── DataMigrations/     EF Core migrations
│   ├── models/             Item, Location, StockLevel entities
│   ├── dtos/               request / response records
│   ├── endpoints/          Items, Locations and StockLevels endpoints
│   └── inventory.http      example requests
└── inventory-web/          React frontend
    └── src/
        ├── Pages/          one component per route (main.jsx holds the router)
        ├── components/     reusable UI (EntityList, EntityDetails, PageHeader, …)
        ├── hooks/          shared data-loading hooks
        ├── api/            fetch wrappers for each API resource
        ├── styles.js       shared Tailwind class strings
        └── index.css       Tailwind import + theme colors
```

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20 or newer
- A running PostgreSQL server

### 1. Run the API

```bash
cd Inventory.Api
cp .env.example .env
```

Edit `.env` and set your Postgres connection string:

```
ConnectionStrings__DbConnection='Host=localhost;Database=inventory;Username=postgres;Password=your_password'
```

Then start it:

```bash
dotnet run
```

The API runs at **http://localhost:5123**. On startup it applies any pending migrations and seeds a few example items, locations and stock levels if the tables are empty. You don't need to run `dotnet ef database update` yourself.

### 2. Run the frontend

```bash
cd inventory-web
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**.

`.env` holds a single setting, the API's base URL (without `/api`):

```
VITE_API_URL=http://localhost:5123
```

### Frontend scripts

| Command           | What it does                     |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start the dev server             |
| `npm run build`   | Production build into `dist/`    |
| `npm run preview` | Serve the production build       |
| `npm run lint`    | Run ESLint                       |

## API

All routes are under `/api`. Request and response bodies are JSON.

### Items: `/api/items`

| Method | Route   | Description                                         |
| ------ | ------- | --------------------------------------------------- |
| GET    | `/`     | List items                                          |
| GET    | `/{id}` | Get one item                                        |
| POST   | `/`     | Create `{ name, sku, description }`                 |
| PUT    | `/{id}` | Update an item                                      |
| DELETE | `/{id}` | Delete (`409 Conflict` if the item still has stock) |

### Locations: `/api/locations`

| Method | Route   | Description                                             |
| ------ | ------- | ------------------------------------------------------- |
| GET    | `/`     | List locations                                          |
| GET    | `/{id}` | Get one location                                        |
| POST   | `/`     | Create `{ name, code }`                                 |
| PUT    | `/{id}` | Update a location                                       |
| DELETE | `/{id}` | Delete (`409 Conflict` if the location still has stock) |

### Stock levels: `/api/stocklevels`

| Method | Route                    | Description                                                 |
| ------ | ------------------------ | ----------------------------------------------------------- |
| GET    | `/`                      | List all stock levels                                       |
| GET    | `/{id}`                  | Get one stock level                                         |
| GET    | `/item/{itemId}`         | Stock of one item across locations                          |
| GET    | `/location/{locationId}` | Stock held at one location                                  |
| POST   | `/receive`               | Add stock `{ itemId, locationId, quantity }`                |
| POST   | `/transfer`              | Move stock `{ itemId, fromLocationId, toLocationId, quantity }` |
| PUT    | `/{id}`                  | Set the quantity `{ quantity }`                             |
| DELETE | `/{id}`                  | Delete a stock level                                        |

The stock level `GET` routes return:

```json
{ "id": 4, "itemId": 1, "locationId": 1, "itemName": "Item 1", "locationName": "Location 1", "quantity": 100 }
```

[`Inventory.Api/inventory.http`](Inventory.Api/inventory.http) has ready-made requests you can run from VS Code or Rider. In development, the OpenAPI document is served at `/openapi/v1.json`.

## Deployment notes

- The frontend is a single-page app. [`inventory-web/vercel.json`](inventory-web/vercel.json) sends every path to `index.html`, so direct links like `/items/3` work on Vercel.
- CORS on the API only allows `http://localhost:5173`, which is set in `Program.cs`. Add your deployed frontend's URL there before you deploy.
- Set `VITE_API_URL` in your hosting provider's environment variables to point at the deployed API.
