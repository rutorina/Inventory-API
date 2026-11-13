import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../App.css";
import ItemLine from "../item-components/itemLine.jsx";
import "../components/ActionButton.jsx";
import addIcon from "../assets/add.png";
import ReturnButton from "../components/ReturnButton.jsx";
import { getItems, createItem } from "../api/items.js";

import ActionButton from "../components/ActionButton.jsx";

function Items() {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    description: "",
  });
  useEffect(() => {
    getItems()
      .then(setData)
      .catch((error) => toast.error(error.message));
  }, []);

  async function handleAddItem(newItem) {
    if (!newItem.name || !newItem.sku || !newItem.description) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const createdItem = await createItem(newItem);
      toast.success("Item added successfully!");
      setData((prevData) => [...prevData, createdItem]);
      setNewItem({ name: "", sku: "", description: "" });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <h1>Items</h1>
      <div className="item-grid">
        <div className="item-grid-header">
          <h3>Name</h3>
          <h3>SKU</h3>
          <h3>Description</h3>
        </div>
        <div className="item-line">
          <input
            placeholder="Enter new item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            placeholder="Enter new item SKU"
            value={newItem.sku}
            onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
          />
          <input
            placeholder="Enter new item description"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
          />
        </div>
        {data.map((line) => (
          <ItemLine key={line.id} item={line} />
        ))}
      </div>
      <div className="absolute right-[16px] top-[16px]">
        <ActionButton
          onClick={() => handleAddItem(newItem)}
          iconSrc={addIcon}
          altText="Add Item"
        />
      </div>
      <ReturnButton LinkTo="/" />
    </>
  );
}

export default Items;
