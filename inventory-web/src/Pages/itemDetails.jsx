import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import "../App.css";
import DetailField from "../item-components/DetailField.jsx";
import Modal from "../components/Modal.jsx";
import ReturnButton from "../components/ReturnButton.jsx";
import ActionButton from "../components/ActionButton.jsx";
import { getItem, updateItem, deleteItem } from "../api/items.js";

import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import checkIcon from "../assets/check.png";
import cancelIcon from "../assets/cancel.png";

const FIELDS = [
  ["Name", "name"],
  ["SKU", "sku"],
  ["Description", "description"],
];
const EMPTY_ITEM = { id: "", name: "", sku: "", description: "" };

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(EMPTY_ITEM);
  const [originalItem, setOriginalItem] = useState(EMPTY_ITEM);
  const [loadError, setLoadError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setLoadError(null);
    getItem(id)
      .then((data) => {
        setItem(data);
        setOriginalItem(data);
      })
      .catch((error) => setLoadError(error.message));
  }, [id]);

  function handleSaveClick() {
    if (FIELDS.some(([, key]) => !item[key].trim())) {
      toast("Please fill in all fields before saving.");
      return;
    }
    if (FIELDS.every(([, key]) => item[key] === originalItem[key])) {
      setIsEditing(false);
      return;
    }
    setSaveOpen(true);
  }

  async function handleConfirmSave() {
    try {
      const saved = await updateItem(id, item);
      setItem(saved);
      setOriginalItem(saved);
      setIsEditing(false);
      toast.success("Item details updated successfully!");
    } catch (error) {
      // Stay in edit mode so the user can fix the problem (e.g. duplicate SKU).
      toast.error(error.message);
    }
  }

  function handleCancelClick() {
    setItem(originalItem);
    setIsEditing(false);
  }

  async function handleDeleteConfirm() {
    try {
      await deleteItem(id);
      toast.success("Item deleted.");
      navigate("/items");
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loadError) {
    return (
      <>
        <div className="item-detail-header">
          <h1>Item not found</h1>
        </div>
        <p className="text-center">{loadError}</p>
        <ReturnButton LinkTo="/items" />
      </>
    );
  }

  return (
    <>
      <Modal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        onConfirm={handleConfirmSave}
        header="Confirmation"
        text="Are you sure you want to apply changes?"
      />
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        header="Delete Item"
        text={`Are you sure you want to delete ${item.name}? This cannot be undone.`}
        buttonText="Delete"
        color="red"
        focus="cancel"
      />

      <div className="item-detail-header">
        <h1>{isEditing ? "Edit Item" : "Item Details"}</h1>
      </div>
      {FIELDS.map(([label, key]) => (
        <div className="item-detail" key={key}>
          <DetailField
            label={label}
            value={item[key]}
            isEditing={isEditing}
            setter={(val) => setItem({ ...item, [key]: val })}
          />
        </div>
      ))}
      <div className="item-detail-actions">
        {isEditing ? (
          <>
            <ActionButton iconSrc={checkIcon} altText="Save" onClick={handleSaveClick} />
            <ActionButton iconSrc={cancelIcon} altText="Cancel" onClick={handleCancelClick} />
          </>
        ) : (
          <>
            <ActionButton iconSrc={editIcon} altText="Edit" onClick={() => setIsEditing(true)} />
            <ActionButton iconSrc={deleteIcon} altText="Delete" onClick={() => setDeleteOpen(true)} />
          </>
        )}
      </div>

      <ReturnButton LinkTo="/items" />
    </>
  );
}

export default ItemDetails;
