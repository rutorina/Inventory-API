import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../App.css";
import ItemLine from "../item-components/itemLine.jsx";
import { getItems } from "../api/items.js";

function Items() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getItems()
      .then(setData)
      .catch((error) => toast.error(error.message));
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
