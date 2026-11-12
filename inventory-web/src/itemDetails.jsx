import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect, useRef } from "react";

import "./App.css";
import ItemLine from "./item-components/itemLine.jsx";
import DetailField from "./item-components/DetailField.jsx";
import Modal from "./item-components/Modal.jsx";

import { useParams, useNavigate } from "react-router";
import editIcon from "./assets/edit.png";
import deleteIcon from "./assets/delete.png";
import checkIcon from "./assets/check.png";
import cancelIcon from "./assets/cancel.png";

function ItemDetails() {
  const [item, setItem] = useState({
    id: "",
    name: "",
    sku: "",
    description: "",
  });
  const [originalItem, setOriginalItem] = useState({
    id: "",
    name: "",
    sku: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const confirmButtonRef = useRef(null);

  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteCancelButtonRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/items/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setItem(data);
        setOriginalItem(data);
      })
      .catch(() => toast.error("Error fetching item details, please try again."));
  }, []);

  useEffect(() => {
    if (open) {
      confirmButtonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (deleteOpen) {
      deleteCancelButtonRef.current?.focus();
    }
  }, [deleteOpen]);

  useEffect(() => {
    setIsEditing(false);
    if (confirm) {
      fetch(`${import.meta.env.VITE_API_URL}/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })
        .then((response) => response.json())
        .then((data) => {
          setItem(data);
          setOriginalItem(data);
          setIsEditing(false);
          setConfirm(false);
          toast.success("Item details updated successfully!");
        })
        .catch(() => toast.error("Error updating item details, please try again."));
    }
  }, [confirm]);

  function handleEditClick() {
    setIsEditing(!isEditing);
  }

  function handleSaveClick() {
    if (item.name == "" || item.sku == "" || item.description == "") {
      toast("Please fill in all fields before saving.");
      return;
    }
    if (
      item.name === originalItem.name &&
      item.sku === originalItem.sku &&
      item.description === originalItem.description
    ) {
      setIsEditing(false);
      return;
    }

    setOpen(true);
  }

  function handleCancelClick() {
    setItem(originalItem);
    setIsEditing(false);
  }

  function handleDeleteClick() {
    setDeleteOpen(true);
  }

  function handleDeleteConfirm() {
    setDeleteOpen(false);
    fetch(`${import.meta.env.VITE_API_URL}/api/items/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          // 409 sends a reason in the body; 404 and others send nothing
          return response
            .json()
            .catch(() => null)
            .then((message) => {
              throw new Error(
                message ?? `Delete failed (status ${response.status}).`,
              );
            });
        }
        toast.success("Item deleted.");
        navigate("/items");
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        // fetch throws a TypeError only when the server can't be reached
        toast.error(
          error instanceof TypeError
            ? "Could not reach the server."
            : error.message,
        );
      });
  }

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-3xl! font-bold! mb-4! text-white!">Confirmation</h2>
        <p className="text-center">Are you sure you want to apply changes?</p>
        <div className="mt-6! flex justify-around gap-4">
          <button
            ref={confirmButtonRef}
            className="px-4! py-2! font-semibold rounded-lg text-white bg-green-600! hover:bg-green-700! shadow-lg shadow-green-400/40"
            onClick={() => {
              setOpen(false);
              setConfirm(true);
            }}
          >
            Confirm
          </button>
          <button
            className="px-4! py-2! font-semibold rounded-lg text-white bg-gray-500! hover:bg-gray-600! shadow-lg"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <h2 className="text-3xl! font-bold! mb-4! text-white!">Delete Item</h2>
        <p className="text-center">
          Are you sure you want to delete <strong>{item.name}</strong>? This
          cannot be undone.
        </p>
        <div className="mt-6! flex justify-around gap-4">
          <button
            className="px-4! py-2! font-semibold rounded-lg text-white bg-red-600! hover:bg-red-700! shadow-lg shadow-red-400/40"
            onClick={handleDeleteConfirm}
          >
            Delete
          </button>
          <button
            ref={deleteCancelButtonRef}
            className="px-4! py-2! font-semibold rounded-lg text-white bg-gray-500! hover:bg-gray-600! shadow-lg"
            onClick={() => setDeleteOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      <div className="item-detail-header">
        <h1>{isEditing ? "Edit Item" : "Item Details"}</h1>
      </div>
      <div className="item-detail">
        <DetailField
          label="Name"
          value={item.name}
          isEditing={isEditing}
          setter={(val) => setItem({ ...item, name: val })}
        />
      </div>
      <div className="item-detail">
        <DetailField
          label="SKU"
          value={item.sku}
          isEditing={isEditing}
          setter={(val) => setItem({ ...item, sku: val })}
        />
      </div>
      <div className="item-detail">
        <DetailField
          label="Description"
          value={item.description}
          isEditing={isEditing}
          setter={(val) => setItem({ ...item, description: val })}
        />
      </div>
      <div className="item-detail-actions">
        {isEditing ? (
          <div className="item-detail-action" onClick={handleSaveClick}>
            <img
              className="item-detail-action-icon"
              src={checkIcon}
              alt="Save"
            />
          </div>
        ) : (
          <div className="item-detail-action" onClick={handleEditClick}>
            <img
              className="item-detail-action-icon"
              src={editIcon}
              alt="Edit"
            />
          </div>
        )}
        {isEditing ? (
          <div className="item-detail-action" onClick={handleCancelClick}>
            <img
              className="item-detail-action-icon"
              src={cancelIcon}
              alt="Cancel"
            />
          </div>
        ) : (
          <div className="item-detail-action" onClick={handleDeleteClick}>
            <img
              className="item-detail-action-icon"
              src={deleteIcon}
              alt="Delete"
            />
          </div>
        )}
      </div>
      <Toaster
        toastOptions={{
          className:
            "px-8 !min-w-sm !bg-yellow-600 !text-white !border !border-slate-700 !rounded-xl !shadow-2xl",
          success: {
            className:
              "px-8 !min-w-sm  !bg-emerald-950 !text-emerald-200 !border-emerald-500",
          },
          error: {
            className:
              "px-8 !min-w-sm !bg-rose-950 !text-rose-200 !border-rose-500",
          },
        }}
      />
    </>
  );
}

export default ItemDetails;
