import { fieldClass, labelClass } from "../styles.js";

export default function DetailField({
  label,
  value,
  isEditing = false,
  setter,
}) {
  return (
    <div className="px-6 py-5">
      <label className={labelClass}>{label}</label>
      {isEditing ? (
        <input
          type="text"
          className={fieldClass}
          value={value}
          onChange={(e) => setter(e.target.value)}
        />
      ) : (
        <p className="min-h-[1.75rem] text-xl text-white">
          {value || <span className="text-gray-500">—</span>}
        </p>
      )}
    </div>
  );
}
