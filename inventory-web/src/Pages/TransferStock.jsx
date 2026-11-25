import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import useItemsAndLocations from "../hooks/useItemsAndLocations.js";
import { transferStock, getStockByItem } from "../api/stockLevels.js";
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

export default function TransferStock() {
  const { items, locations } = useItemsAndLocations();
  const [chosenItemId, setItemId] = useState("");
  const [fromLocationId, setFromLocationId] = useState("");
  const [toLocationId, setToLocationId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [itemStock, setItemStock] = useState([]);
  const [stockVersion, setStockVersion] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const itemId = chosenItemId || (items[0]?.id ?? "");

  useEffect(() => {
    if (!itemId) return;
    let ignore = false;
    getStockByItem(itemId)
      .then((data) => {
        if (!ignore) setItemStock(data);
      })
      .catch((error) => toast.error(error.message));
    return () => {
      ignore = true;
    };
  }, [itemId, stockVersion]);

  // Only locations that actually hold this item can be a source
  const availableAt = new Map(
    itemStock
      .filter((sl) => sl.quantity > 0)
      .map((sl) => [sl.locationId, sl.quantity]),
  );
  const sourceLocations = locations.filter((loc) => availableAt.has(loc.id));

  // If the chosen source no longer holds the item, fall back to the first one that does
  const effectiveFromId = availableAt.has(fromLocationId)
    ? fromLocationId
    : (sourceLocations[0]?.id ?? "");
  const available = availableAt.get(effectiveFromId) ?? 0;

  // Destination can be any location except the source
  const destinationLocations = locations.filter(
    (loc) => loc.id !== effectiveFromId,
  );
  const effectiveToId = destinationLocations.some(
    (loc) => loc.id === toLocationId,
  )
    ? toLocationId
    : (destinationLocations[0]?.id ?? "");

  const selectedItem = items.find((itm) => itm.id === itemId);
  const fromLocation = locations.find((loc) => loc.id === effectiveFromId);
  const toLocation = locations.find((loc) => loc.id === effectiveToId);
  const noStock = sourceLocations.length === 0;
  const tooMany = quantity > available;

  function swapLocations() {
    setFromLocationId(effectiveToId);
    setToLocationId(effectiveFromId);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!itemId || !effectiveFromId || !effectiveToId) {
      toast.error("Please choose an item and both locations.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    if (tooMany) {
      toast.error(`Only ${available} available at ${fromLocation?.name}.`);
      return;
    }
    setSubmitting(true);
    try {
      await transferStock({
        itemId,
        fromLocationId: effectiveFromId,
        toLocationId: effectiveToId,
        quantity,
      });
      toast.success(
        `Moved ${quantity} × ${selectedItem?.name} from ${fromLocation?.name} to ${toLocation?.name}.`,
      );
      setQuantity(1);
      setStockVersion((v) => v + 1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="Transfer Stock" backTo="/" />

      <FormCard onSubmit={handleSubmit}>
        <div className="mb-6">
          <ItemSelect
            id="item"
            label="Item"
            value={itemId}
            onChange={setItemId}
            items={items}
          />
          <ItemDetails item={selectedItem} />
        </div>

        <div className="mb-6 grid grid-cols-1 items-start gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div>
            <LocationSelect
              id="from"
              label="From"
              value={effectiveFromId}
              onChange={setFromLocationId}
              locations={sourceLocations}
              emptyText="Not in stock anywhere"
            />
            <LocationDetails location={fromLocation} available={available} />
          </div>

          <button
            type="button"
            onClick={swapLocations}
            disabled={!availableAt.has(effectiveToId)}
            title="Swap locations"
            aria-label="Swap locations"
            className="mx-auto rounded-full border border-(--border) px-3 py-2 text-xl text-gray-300 transition hover:border-(--accent) hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:mt-8"
          >
            ⇄
          </button>

          <div>
            <LocationSelect
              id="to"
              label="To"
              value={effectiveToId}
              onChange={setToLocationId}
              locations={destinationLocations}
              emptyText="No other locations"
            />
            <LocationDetails location={toLocation} />
          </div>
        </div>

        {noStock && (
          <p className="-mt-2 mb-6 text-sm text-red-400">
            This item isn't stocked at any location, so there is nothing to
            transfer.
          </p>
        )}

        <QuantityField
          value={quantity}
          onChange={setQuantity}
          max={available || undefined}
        />
        {!noStock && tooMany && (
          <p className="-mt-6 mb-6 text-sm text-red-400">
            Only {available} available at {fromLocation?.name}.
          </p>
        )}

        <SubmitButton
          submitting={submitting}
          disabled={noStock || !effectiveToId || tooMany}
          busyText="Transferring…"
        >
          Transfer Stock
        </SubmitButton>
      </FormCard>
    </>
  );
}
