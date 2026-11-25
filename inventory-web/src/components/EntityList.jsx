import { useState, useEffect } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";

import ActionButton from "./ActionButton.jsx";
import LoadError from "./LoadError.jsx";
import PageHeader from "./PageHeader.jsx";
import addIcon from "../assets/add.png";
import { cardClass, skeletonClass } from "../styles.js";

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
  nested = false,
}) {
  const [draft, setDraft] = useState(() => emptyFrom(fields));
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({
    load: null,
    attempt: -1,
    rows: [],
    error: null,
  });

  useEffect(() => {
    let ignore = false;
    load()
      .then((rows) => {
        if (!ignore) setResult({ load, attempt, rows, error: null });
      })
      .catch((error) => {
        if (!ignore)
          setResult({ load, attempt, rows: [], error: error.message });
      });
    return () => {
      ignore = true;
    };
  }, [load, attempt]);

  const loading = result.load !== load || result.attempt !== attempt;
  const error = loading ? null : result.error;
  const rows = loading ? [] : result.rows;
  const ready = !loading && !error;

  async function handleAdd() {
    if (fields.some(([, key]) => !draft[key].trim())) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const created = await create(draft);
      setResult((prev) => ({ ...prev, rows: [...prev.rows, created] }));
      setDraft(emptyFrom(fields));
      toast.success(`${entityName} added successfully!`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Related lists stay out of the way until we know they have something to show
  if (hideWhenEmpty && (loading || (ready && rows.length === 0))) return null;

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
            create &&
            ready && (
              <ActionButton
                onClick={handleAdd}
                iconSrc={addIcon}
                altText={`Add ${entityName}`}
              />
            )
          }
        />
      )}

      {error ? (
        <LoadError
          title={`Couldn't load ${title.toLowerCase()}`}
          message={error}
          onRetry={() => setAttempt((a) => a + 1)}
        />
      ) : (
        <div className={`${cardClass} overflow-hidden`} aria-busy={loading}>
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
          {create && ready && (
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
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
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
          {loading &&
            [0, 1, 2].map((i) => (
              <div
                key={i}
                style={gridStyle}
                className="grid border-t border-(--border)"
              >
                {fields.map(([, key]) => (
                  <span className={cellClass} key={key}>
                    <span className={`${skeletonClass} block h-5 w-3/4`} />
                  </span>
                ))}
              </div>
            ))}

          {ready && rows.length === 0 && (
            <p className="border-t border-(--border) px-5 py-8 text-center text-gray-500">
              Nothing here yet.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
