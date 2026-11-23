import PageLink from "../components/PageLink.jsx";

const pages = [
  {
    path: "/items",
    title: "Items",
    description: "Browse, add and edit the items you keep in stock.",
  },
  {
    path: "/locations",
    title: "Locations",
    description: "Warehouses, shelves and anywhere else stock lives.",
  },
  {
    path: "/stock/receive",
    title: "Receive Stock",
    description: "Book incoming stock into a location.",
  },
  {
    path: "/stock/transfer",
    title: "Transfer Stock",
    description: "Move stock from one location to another.",
  },
  {
    path: "/stock/levels",
    title: "Stock Levels",
    description: "See how much of every item is where.",
  },
];

function App() {
  return (
    <main>
      <header className="py-12 text-center">
        <h1 className="m-0 text-4xl font-bold tracking-tight sm:text-6xl">
          Rut<span className="text-(--accent)">Inventory</span>
        </h1>
        <p className="mt-3 text-lg text-gray-400">
          Keep track of what you have and where it is.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <PageLink key={page.path} {...page} />
        ))}
      </div>
    </main>
  );
}

export default App;
