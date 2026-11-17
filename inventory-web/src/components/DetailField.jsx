import React from "react";

export default function DetailField({ label, value, isEditing = false, setter }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-400 mb-1">{label}</label>
      {isEditing ? (
        <input
          type="text"
          className="item-detail-edit"
          value={value}
          onChange={(e) => setter(e.target.value)}
          readOnly={!isEditing}
        />
      ) : (
        <p className="text-white">{value}</p>
      )}
    </div>
  );
}
