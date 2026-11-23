import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { getLocations } from "../api/locations";
import { getItems } from "../api/items";
import { receiveStock } from "../api/stockLevels.js";
import PageHeader from "../components/PageHeader.jsx";
import {
  FormCard,
  ItemSelect,
  LocationSelect,
  ItemDetails,
  LocationDetails,
  QuantityField,
  SubmitButton,
} from "../components/StockForm.jsx";

export default function ReceiveStock() {
  const [itemId, setItemId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getItems()
      .then((data) => {
        setItems(data);
        if (data.length > 0) setItemId(data[0].id);
      })
      .catch((error) => toast.error(error.message));
    getLocations()
      .then((data) => {
        setLocations(data);
        if (data.length > 0) setLocationId(data[0].id);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  const selectedItem = items.find((itm) => itm.id === itemId);
  const selectedLocation = locations.find((loc) => loc.id === locationId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!itemId || !locationId) {
      toast.error("Please choose an item and a location.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    setSubmitting(true);
    try {
      await receiveStock({ itemId, locationId, quantity });
      toast.success(
        `Received ${quantity} × ${selectedItem?.name} at ${selectedLocation?.name}.`,
      );
      setQuantity(1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="Receive Stock" backTo="/" />

      <FormCard onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <ItemSelect
              id="item"
              label="Item"
              value={itemId}
              onChange={setItemId}
              items={items}
            />
            <ItemDetails item={selectedItem} />
          </div>

          <div>
            <LocationSelect
              id="location"
              label="Location"
              value={locationId}
              onChange={setLocationId}
              locations={locations}
            />
            <LocationDetails location={selectedLocation} />
          </div>
        </div>

        <QuantityField value={quantity} onChange={setQuantity} />

        <SubmitButton submitting={submitting} busyText="Receiving…">
          Receive Stock
        </SubmitButton>
      </FormCard>
    </>
  );
}
