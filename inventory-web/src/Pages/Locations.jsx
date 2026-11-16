import ActionButton from "../components/ActionButton.jsx";
import addIcon from "../assets/add.png";
import ReturnButton from "../components/ReturnButton.jsx";
import LocationLine from "../location-components/LocationLine.jsx";
import { toast } from "react-hot-toast";
import "../App.css";
import { useEffect, useState } from "react";
import { getLocations } from "../api/location.js";

export default function Locations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((error) => toast.error(error.message));
  }, []);

  return (
    <>
      <h1>Locations</h1>
      <div className="item-grid grid-cols-2!">
        <div className="item-grid-header">
          <h3>Name</h3>
          <h3>Code</h3>
        </div>
        <div className="item-line">
          <input placeholder="Enter new location name" />
          <input placeholder="Enter new location code" />
        </div>
        {locations.map((location) => (
          <LocationLine key={location.id} location={location} />
        ))}
      </div>
      <div className="absolute right-[16px] top-[16px]">
        <ActionButton
          onClick={() =>
            toast("Add Location functionality not implemented yet.")
          }
          iconSrc={addIcon}
          altText="Add Location"
        />
      </div>

      <ReturnButton LinkTo="/" />
    </>
  );
}
