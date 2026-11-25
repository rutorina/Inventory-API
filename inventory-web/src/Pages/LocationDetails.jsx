import EntityDetails from "../components/EntityDetails.jsx";
import {
  getLocation,
  updateLocation,
  deleteLocation,
} from "../api/locations.js";
import { getStockByLocation } from "../api/stockLevels.js";

const FIELDS = [
  ["Name", "name"],
  ["Code", "code"],
];

export default function LocationDetails() {
  return (
    <EntityDetails
      entityName="Location"
      fields={FIELDS}
      load={getLocation}
      update={updateLocation}
      remove={deleteLocation}
      backTo="/locations"
      loadRelated={getStockByLocation}
      relatedFields={[
        ["Item Name", "itemName"],
        ["Quantity", "quantity"],
      ]}
      relatedTitle="Items at this Location"
    />
  );
}
