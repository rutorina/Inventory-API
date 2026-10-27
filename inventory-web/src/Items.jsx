import { useState, useEffect } from "react";
import "./App.css";
import ItemLine from "./item-components/itemLine.jsx";

function Items() {
  const [data, setData] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/items`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  return (
    <>
      <h1>Items</h1>
      <div className="item-grid">
        <div className="item-grid-header">
          <h3>Name</h3>
          <h3>SKU</h3>
          <h3>Description</h3>
        </div>

        {data.map((line) => (
            <ItemLine key={line.id} item={line} />
        ))}
      </div>
    </>
  );
}

export default Items;
