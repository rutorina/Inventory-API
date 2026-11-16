import React from "react";
import { Link } from "react-router";
import "../App.css";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

function ItemLine({ item, toggleEditMode }) {
  return (
    <Link
      key={item.id}
      className="item-line item-link"
      to={`/items/${item.id}`}
    >
      <h4 className="item-line-content">{item.name}</h4>
      <h4 className="item-line-content">{item.sku}</h4>
      <h4 className="item-line-content">{item.description}</h4>
    </Link>
  );
}

export default ItemLine;
