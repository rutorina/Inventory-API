// Shared building blocks for the stock forms (Receive / Transfer).

import { cardClass, fieldClass, labelClass } from "../styles.js";

export function FormCard({ onSubmit, children }) {
  return (
    <form
      onSubmit={onSubmit}
      className={`${cardClass} mx-auto w-full max-w-2xl p-8 text-left`}
    >
      {children}
    </form>
  );
}

export function DetailsCard({ title, badge, text }) {
  return (
    <div className="mt-3 rounded-xl border border-(--accent-border) bg-(--accent-bg) p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {badge && (
          <span className="rounded-md bg-black/30 px-2 py-1 font-mono text-sm text-gray-300">
            {badge}
          </span>
        )}
      </div>
      {text && <p className="mt-2 text-gray-300">{text}</p>}
    </div>
  );
}

/** Dropdown of entities by id; `optionLabel` decides what each option shows. */
function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  optionLabel,
  emptyText = "Nothing to choose",
}) {
  return (
    <>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        id={id}
        className={fieldClass}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.length === 0 && <option value="">{emptyText}</option>}
        {options.map((opt) => (
          <option key={opt.id} value={opt.id} className="bg-gray-900">
            {optionLabel(opt)}
          </option>
        ))}
      </select>
    </>
  );
}

export function ItemDetails({ item }) {
  return item ? (
    <DetailsCard title={item.name} badge={item.sku} text={item.description} />
  ) : null;
}

export function LocationDetails({ location, available }) {
  return location ? (
    <DetailsCard
      title={location.name}
      badge={location.code}
      text={
        available !== undefined ? `Available here: ${available}` : undefined
      }
    />
  ) : null;
}

// Dropdowns show only the short code; full info lives in the details cards.
export function ItemSelect({ items, ...props }) {
  return (
    <SelectField
      {...props}
      options={items}
      optionLabel={(itm) => itm.sku || itm.name}
    />
  );
}

export function LocationSelect({ locations, ...props }) {
  return (
    <SelectField
      {...props}
      options={locations}
      optionLabel={(loc) => loc.code || loc.name}
    />
  );
}

export function QuantityField({ value, onChange, max }) {
  return (
    <div className="mb-8">
      <label htmlFor="quantity" className={labelClass}>
        Quantity
      </label>
      <input
        id="quantity"
        type="number"
        min={1}
        max={max}
        step={1}
        className={fieldClass}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export function SubmitButton({ submitting, disabled, children, busyText }) {
  return (
    <button
      type="submit"
      disabled={submitting || disabled}
      className="w-full rounded-lg bg-(--accent) px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-(--accent-bg) transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {submitting ? busyText : children}
    </button>
  );
}
