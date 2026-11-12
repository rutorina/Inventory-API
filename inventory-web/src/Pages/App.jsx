import { useState, useEffect } from "react";
import "../App.css";
import { Toaster } from "react-hot-toast";
import Modal from "../components/Modal.jsx";

function App() {
  const [data, setData] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/api/items`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);
  // use Link from react-router for navigation
  return (
    <main>
      <h1>Inventory Items</h1>
    </main>
  );
}

export default App;
