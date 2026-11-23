import EntityList from "../components/EntityList.jsx";
import { getLocations, createLocation } from "../api/locations.js";

const FIELDS = [
  ["Name", "name"],
  ["Code", "code"],
];

const locationLink = (location) => `/locations/${location.id}`;

export default function Locations() {
  return (
    <EntityList
      title="Locations"
      entityName="Location"
      fields={FIELDS}
      load={getLocations}
      create={createLocation}
      backTo="/"
      rowLink={locationLink}
    />
  );
}
