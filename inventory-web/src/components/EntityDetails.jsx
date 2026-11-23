import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";

import DetailField from "./DetailField.jsx";
import Modal from "./Modal.jsx";
import PageHeader from "./PageHeader.jsx";
import { cardClass } from "../styles.js";
import ActionButton from "./ActionButton.jsx";

import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import checkIcon from "../assets/check.png";
import cancelIcon from "../assets/cancel.png";

import EntityList from "./EntityList.jsx";

export default function EntityDetails({
  entityName,
  fields,
  load,
  update,
  remove,
  backTo,
  children,
  childrenKeys,
  childrenTitle,
  childrenEntityName = "Item",
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entity, setEntity] = useState(null);
  const [original, setOriginal] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setLoadError(null);
    load(id)
      .then((data) => {
        setEntity(data);
        setOriginal(data);
      })
      .catch((error) => setLoadError(error.message));
  }, [id, load]);

  // Stable function so EntityList's useEffect doesn't refetch on every render
  const loadChildren = useCallback(() => children(id), [children, id]);

  const valueOf = (obj, key) => String(obj?.[key] ?? "");

  function handleSaveClick() {
    if (fields.some(([, key]) => !valueOf(entity, key).trim())) {
      toast("Please fill in all fields before saving.");
      return;
    }
    if (
      fields.every(([, key]) => valueOf(entity, key) === valueOf(original, key))
    ) {
      setIsEditing(false);
      return;
    }
    setSaveOpen(true);
  }

  async function handleConfirmSave() {
    try {
      const saved = await update(id, entity);
      setEntity(saved);
      setOriginal(saved);
      setIsEditing(false);
      toast.success(`${entityName} updated successfully!`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handleCancelClick() {
    setEntity(original);
    setIsEditing(false);
  }

  async function handleDeleteConfirm() {
    try {
      await remove(id);
      toast.success(`${entityName} deleted.`);
      navigate(backTo);
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loadError) {
    return (
      <>
        <PageHeader title={`${entityName} not found`} backTo={backTo} />
        <p className="text-center text-gray-400">{loadError}</p>
      </>
    );
  }

  const actions = isEditing ? (
    <>
      <ActionButton
        iconSrc={checkIcon}
        altText="Save"
        onClick={handleSaveClick}
      />
      <ActionButton
        iconSrc={cancelIcon}
        altText="Cancel"
        onClick={handleCancelClick}
      />
    </>
  ) : (
    <>
      <ActionButton
        iconSrc={editIcon}
        altText="Edit"
        onClick={() => setIsEditing(true)}
      />
      <ActionButton
        iconSrc={deleteIcon}
        altText="Delete"
        onClick={() => setDeleteOpen(true)}
      />
    </>
  );

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
        header={`Delete ${entityName}`}
        text={`Are you sure you want to delete ${entity?.name ?? `this ${entityName.toLowerCase()}`}? This cannot be undone.`}
        buttonText="Delete"
        color="red"
        focus="cancel"
      />

      <PageHeader
        title={isEditing ? `Edit ${entityName}` : `${entityName} Details`}
        backTo={backTo}
        actions={actions}
      />

      <div
        className={`${cardClass} mx-auto max-w-2xl divide-y divide-(--border) text-left transition ${
          isEditing ? "border-(--accent-border)" : ""
        }`}
      >
        {fields.map(([label, key]) => (
          <DetailField
            key={key}
            label={label}
            value={valueOf(entity, key)}
            isEditing={isEditing}
            setter={(val) => setEntity({ ...entity, [key]: val })}
          />
        ))}
      </div>

      {children && (
        <div className="mx-auto max-w-2xl">
          <EntityList
            title={childrenTitle ?? "Related"}
            entityName={childrenEntityName}
            fields={childrenKeys}
            load={loadChildren}
            hideWhenEmpty
            nested
          />
        </div>
      )}
    </>
  );
}
