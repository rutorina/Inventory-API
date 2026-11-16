import { Link } from "react-router";

export default function LocationLine({ location }) {
  return (
    <Link to={`/locations/${location.id}`} className="item-line item-link">
      <h4 className="item-line-content">{location.name}</h4>
      <h4 className="item-line-content">{location.code}</h4>
    </Link>
  );
}
