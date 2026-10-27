import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/items`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);
// use Link from react-router for navigation
  return (
    <>
      <ul>
        {data.map((line) => (
          <li key={line.id}>{line.name}, {line.sku}, {line.description} </li>
        ))}
      </ul>
    </>
  );
}

export default App;
