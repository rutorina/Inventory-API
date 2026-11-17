import EntityList from "../components/EntityList.jsx";
import { getItems, createItem } from "../api/items.js";

const FIELDS = [
  ["Name", "name"],
  ["SKU", "sku"],
  ["Description", "description"],
];

const itemLink = (item) => `/items/${item.id}`;

export default function Items() {
  return (
    <EntityList
      title="Items"
      entityName="Item"
      fields={FIELDS}
      load={getItems}
      create={createItem}
      rowLink={itemLink}
    />
  );
}
