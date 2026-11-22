import "../App.css";
import PageLink from "../components/PageLink.jsx";

function App() {
  const pages = [
    {
      path: "/items",
      title: "Items",
    },
    {
      path: "/locations",
      title: "Locations",
    },
    {
      path: "/stock/receive",
      title: "Receive Stock",
    },
    {
      path: "/stock/transfer",
      title: "Transfer Stock",
    },
    {
      path: "/stock/levels",
      title: "Stock Levels",
    },
  ];

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Routine Inventory Management</h1>
      <div className="flex flex-wrap justify-center gap-5 m-4">
        {pages.map((page) => (
          <PageLink key={page.path} path={page.path} title={page.title} />
        ))}
      </div>
    </main>
  );
}

export default App;
