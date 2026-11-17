import EntityDetails from "../components/EntityDetails.jsx";
import {
  getLocation,
  updateLocation,
  deleteLocation,
} from "../api/location.js";

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
    />
  );
}
