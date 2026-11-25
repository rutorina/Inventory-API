import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";

import DetailField from "./DetailField.jsx";
import Modal from "./Modal.jsx";
import PageHeader from "./PageHeader.jsx";
import LoadError from "./LoadError.jsx";
import NotFound from "../Pages/NotFound.jsx";
import { cardClass, labelClass, skeletonClass } from "../styles.js";
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
  loadRelated,
  relatedFields,
  relatedTitle = "Related",
  relatedEntityName = "Item",
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entity, setEntity] = useState(null);
  const [original, setOriginal] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState({ id: null, attempt: -1, error: null });
  const [isEditing, setIsEditing] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    load(id)
      .then((data) => {
        if (ignore) return;
        setEntity(data);
        setOriginal(data);
        setIsEditing(false);
        setLoaded({ id, attempt, error: null });
      })
      .catch((error) => {
        if (!ignore) setLoaded({ id, attempt, error });
      });
    return () => {
      ignore = true;
    };
  }, [id, load, attempt]);

  const loading = loaded.id !== id || loaded.attempt !== attempt;
  const loadError = loading ? null : loaded.error;

  const loadRelatedForId = useCallback(
    () => loadRelated(id),
    [loadRelated, id],
  );

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

  if (loadError?.status === 404) {
    const name = entityName.toLowerCase();
    return (
      <NotFound
        title={`${entityName} not found`}
        message={`There is no ${name} with id ${id}. It may have been deleted.`}
        backTo={backTo}
        backLabel={`All ${name}s`}
      />
    );
  }

  if (loadError) {
    return (
      <>
        <PageHeader title={`${entityName} Details`} backTo={backTo} />
        <LoadError
          title={`Couldn't load this ${entityName.toLowerCase()}`}
          message={loadError.message}
          onRetry={() => setAttempt((a) => a + 1)}
        />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageHeader title={`${entityName} Details`} backTo={backTo} />
        <div
          aria-busy="true"
          className={`${cardClass} mx-auto max-w-2xl divide-y divide-(--border) text-left`}
        >
          {fields.map(([label, key]) => (
            <div className="px-6 py-5" key={key}>
              <span className={labelClass}>{label}</span>
              <span className={`${skeletonClass} block h-7 w-2/3`} />
            </div>
          ))}
        </div>
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

      {loadRelated && (
        <div className="mx-auto max-w-2xl">
          <EntityList
            title={relatedTitle}
            entityName={relatedEntityName}
            fields={relatedFields}
            load={loadRelatedForId}
            hideWhenEmpty
            nested
          />
        </div>
      )}
    </>
  );
}
