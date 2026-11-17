import EntityDetails from "../components/EntityDetails.jsx";
import { getItem, updateItem, deleteItem } from "../api/items.js";

const FIELDS = [
  ["Name", "name"],
  ["SKU", "sku"],
  ["Description", "description"],
];

export default function ItemDetails() {
  return (
    <EntityDetails
      entityName="Item"
      fields={FIELDS}
      load={getItem}
      update={updateItem}
      remove={deleteItem}
      backTo="/items"
    />
  );
}
