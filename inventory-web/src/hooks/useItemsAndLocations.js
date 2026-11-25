import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getItems } from "../api/items";
import { getLocations } from "../api/locations";

export default function useItemsAndLocations() {
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch((error) => toast.error(error.message));
    getLocations()
      .then(setLocations)
      .catch((error) => toast.error(error.message));
  }, []);

  return { items, locations };
}
