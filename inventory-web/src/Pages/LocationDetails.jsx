import EntityDetails from "../components/EntityDetails.jsx";
import {
  getLocation,
  updateLocation,
  deleteLocation,
} from "../api/location.js";
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
      children={getStockByLocation}
      childrenKeys={[
        ["Item Name", "itemName"],
        ["Quantity", "quantity"],
      ]}
      childrenTitle="Items at this Location"
    />
  );
}
