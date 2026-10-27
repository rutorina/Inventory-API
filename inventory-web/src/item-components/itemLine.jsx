import React from "react";
import { Link } from "react-router";
import "../App.css";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

function ItemLine({ item, toggleEditMode }) {
  return (
    <div key={item.id} className="item-line">
      <h4 className="item-line-content">{item.name}</h4>
      <h4 className="item-line-content">
        <Link className="item-link" to={`/items/${item.id}`}>
          {item.sku}
        </Link>
      </h4>
      <h4 className="item-line-content">{item.description}</h4>
    </div>
  );
}

export default ItemLine;
