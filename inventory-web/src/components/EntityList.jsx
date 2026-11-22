import { useState, useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";

import "../App.css";
import ActionButton from "./ActionButton.jsx";
import ReturnButton from "./ReturnButton.jsx";
import addIcon from "../assets/add.png";

const emptyFrom = (fields) =>
  Object.fromEntries(fields.map(([, key]) => [key, ""]));

const placeholderLabel = (label) =>
  label === label.toUpperCase() ? label : label.toLowerCase();

export default function EntityList({
  title,
  entityName,
  fields,
  load,
  create,
  rowLink,
  backTo,
  hideWhenEmpty = false,
}) {
  const [rows, setRows] = useState([]);
  const [draft, setDraft] = useState(() => emptyFrom(fields));

  useEffect(() => {
    load()
      .then(setRows)
      .catch((error) => toast.error(error.message));
  }, [load]);

  async function handleAdd() {
    if (fields.some(([, key]) => !draft[key].trim())) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const created = await create(draft);
      setRows((prev) => [...prev, created]);
      setDraft(emptyFrom(fields));
      toast.success(`${entityName} added successfully!`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  function renderCells(row) {
    return fields.map(([, key]) => (
      <h4 className="item-line-content" key={key}>
        {row[key]}
      </h4>
    ));
  }

  if (hideWhenEmpty && rows.length === 0) return null;

  return (
    <>
      <h1>{title}</h1>
      <div
        className="item-grid"
        style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}
      >
        <div className="item-grid-header">
          {fields.map(([label, key]) => (
            <h3 key={key}>{label}</h3>
          ))}
        </div>

        {create && (
          <div className="item-line">
            {fields.map(([label, key]) => (
              <input
                key={key}
                placeholder={`Enter new ${entityName.toLowerCase()} ${placeholderLabel(label)}`}
                value={draft[key]}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            ))}
          </div>
        )}

        {rows.map((row) =>
          rowLink ? (
            <Link key={row.id} to={rowLink(row)} className="item-line item-link">
              {renderCells(row)}
            </Link>
          ) : (
            <div key={row.id} className="item-line">
              {renderCells(row)}
            </div>
          ),
        )}
      </div>

      {create && (
        <div className="absolute right-[16px] top-[16px]">
          <ActionButton
            onClick={handleAdd}
            iconSrc={addIcon}
            altText={`Add ${entityName}`}
          />
        </div>
      )}

      {backTo && <ReturnButton LinkTo={backTo} />}
    </>
  );
}
