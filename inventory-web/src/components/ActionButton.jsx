import { iconButtonClass, iconImageClass } from "../styles.js";

export default function ActionButton({ onClick, iconSrc, altText }) {
  return (
    <button
      type="button"
      className={iconButtonClass}
      onClick={onClick}
      title={altText}
    >
      <img className={iconImageClass} src={iconSrc} alt={altText} />
    </button>
  );
}
