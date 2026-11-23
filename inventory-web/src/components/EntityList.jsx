import { useState, useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";

import ActionButton from "./ActionButton.jsx";
import PageHeader from "./PageHeader.jsx";
import addIcon from "../assets/add.png";
import { cardClass } from "../styles.js";

const emptyFrom = (fields) =>
  Object.fromEntries(fields.map(([, key]) => [key, ""]));

const placeholderLabel = (label) =>
  label === label.toUpperCase() ? label : label.toLowerCase();

const cellClass = "px-5 py-3 truncate";

export default function EntityList({
  title,
  entityName,
  fields,
  load,
  create,
  rowLink,
  backTo,
  hideWhenEmpty = false,
  nested = false, // rendered inside another page: smaller heading, no page header
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

  if (hideWhenEmpty && rows.length === 0) return null;

  const gridStyle = { gridTemplateColumns: `repeat(${fields.length}, 1fr)` };
  const rowClass = "grid border-t border-(--border) text-left text-white";

  const cells = (row) =>
    fields.map(([, key]) => (
      <span className={cellClass} key={key}>
        {row[key]}
      </span>
    ));

  return (
    <section>
      {nested ? (
        <h2 className="mt-10 mb-4 text-center text-2xl font-semibold">
          {title}
        </h2>
      ) : (
        <PageHeader
          title={title}
          backTo={backTo}
          actions={
            create && (
              <ActionButton
                onClick={handleAdd}
                iconSrc={addIcon}
                altText={`Add ${entityName}`}
              />
            )
          }
        />
      )}

      <div className={`${cardClass} overflow-hidden`}>
        {/* Header */}
        <div
          className="grid bg-white/[0.04] text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
          style={gridStyle}
        >
          {fields.map(([label, key]) => (
            <span className={`${cellClass} py-4`} key={key}>
              {label}
            </span>
          ))}
        </div>

        {/* New row */}
        {create && (
          <div
            className="grid gap-2 border-t border-(--border) bg-(--accent-bg) p-3"
            style={gridStyle}
          >
            {fields.map(([label, key]) => (
              <input
                key={key}
                className="w-full rounded-md border border-(--border) bg-black/20 px-3 py-2 text-base text-white outline-none transition placeholder:text-gray-500 focus:border-(--accent) focus:ring-2 focus:ring-(--accent-bg)"
                placeholder={`New ${entityName.toLowerCase()} ${placeholderLabel(label)}`}
                value={draft[key]}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            ))}
          </div>
        )}

        {/* Rows */}
        {rows.map((row) =>
          rowLink ? (
            <Link
              key={row.id}
              to={rowLink(row)}
              style={gridStyle}
              className={`${rowClass} transition hover:bg-(--accent-bg) hover:text-(--text-h)`}
            >
              {cells(row)}
            </Link>
          ) : (
            <div key={row.id} style={gridStyle} className={rowClass}>
              {cells(row)}
            </div>
          ),
        )}

        {rows.length === 0 && (
          <p className="border-t border-(--border) px-5 py-8 text-center text-gray-500">
            Nothing here yet.
          </p>
        )}
      </div>
    </section>
  );
}
