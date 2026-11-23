import { Link } from "react-router";
import returnIcon from "../assets/return.png";
import { iconButtonClass, iconImageClass } from "../styles.js";

export default function ReturnButton({ LinkTo }) {
  return (
    <Link to={LinkTo} className={iconButtonClass} title="Back">
      <img className={iconImageClass} src={returnIcon} alt="Return" />
    </Link>
  );
}
