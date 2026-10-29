import { useState, useEffect } from "react";
import "./App.css";

import Modal from "./item-components/Modal";

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

      <button
        className="px-4! py-2! font-semibold rounded-lg text-white bg-red-600! hover:bg-red-700! shadow-lg shadow-red-400/40"
        onClick={() => setOpen(true)}
      >
        Open Modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-3xl! font-bold! mb-4! text-white!">Confirmation</h2>
        <p className="text-center">Are you sure you want to apply changes?</p>
        <div className="mt-6! flex justify-around gap-4">
          <button
            className="px-4! py-2! font-semibold rounded-lg text-white bg-green-600! hover:bg-green-700! shadow-lg shadow-green-400/40"
            onClick={() => setOpen(false)}
          >
            Confirm
          </button>
          <button
            className="px-4! py-2! font-semibold rounded-lg text-white bg-gray-500! hover:bg-gray-600! shadow-lg"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </main>
  );
}

export default App;
