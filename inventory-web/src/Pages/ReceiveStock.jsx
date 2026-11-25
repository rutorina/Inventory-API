import toast from "react-hot-toast";
import { useState } from "react";
import useItemsAndLocations from "../hooks/useItemsAndLocations.js";
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
  const { items, locations } = useItemsAndLocations();
  const [chosenItemId, setItemId] = useState("");
  const [chosenLocationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const itemId = chosenItemId || (items[0]?.id ?? "");
  const locationId = chosenLocationId || (locations[0]?.id ?? "");

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
