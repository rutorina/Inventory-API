import EntityDetails from "../components/EntityDetails.jsx";
import { getItem, updateItem, deleteItem } from "../api/items.js";
import { getStockByItem } from "../api/stockLevels.js";

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
      children={getStockByItem}
      childrenKeys={[
        ["Location Name", "locationName"],
        ["Quantity", "quantity"],
      ]}
      childrenTitle="Locations for this Item"
      childrenEntityName="Location"
    />
  );
}
