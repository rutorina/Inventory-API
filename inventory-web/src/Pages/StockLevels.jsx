import EntityList from "../components/EntityList.jsx";
import { getStockLevels } from "../api/stockLevels.js";

const FIELDS = [
  ["Item", "itemName"],
  ["Location", "locationName"],
  ["Quantity", "quantity"],
];

export default function StockLevels() {
  return (
    <EntityList
      title="Stock Levels"
      entityName="Stock Level"
      fields={FIELDS}
      load={getStockLevels}
    />
  );
}
