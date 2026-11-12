import { Link } from "react-router";
import returnIcon from "../assets/return.png";
import "../App.css";

export default function ReturnButton({ LinkTo }) {
  return (
    <Link
      className="absolute top-[16px] left-[16px] item-detail-action"
      to={LinkTo}
    >
      <img className="item-detail-action-icon" src={returnIcon} alt="Return" />
    </Link>
  );
}
