import { useState, useEffect } from "react";
import "./App.css";
import ItemLine from "./item-components/itemLine.jsx";
import { useParams } from "react-router";

function ItemDetails() {
  const [item, setItem] = useState({
    id: "",
    name: "",
    sku: "",
    description: "",
  });
  const params = new URLSearchParams(window.location.search);
  const { id } = useParams();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/items/${id}`)
      .then((response) => response.json())
      .then((data) => setItem(data))
      .catch((error) => console.error("Error fetching item details:", error));
    // You can fetch item details from an API here if needed
  }, []);

  return (
    <>
      <h1>Item Details</h1>
      <div className="item-detail">
        <h3>Name</h3>
        <p>{item.name}</p>
      </div>
      <div className="item-detail">
        <h3>SKU</h3>
        <p>{item.sku}</p>
      </div>
      <div className="item-detail">
        <h3>Description</h3>
        <p>{item.description}</p>
      </div>
    </>
  );
}

export default ItemDetails;
