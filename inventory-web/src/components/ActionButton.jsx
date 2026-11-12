export default function ActionButton({ onClick, iconSrc, altText }) {
  return (
    <div className="item-detail-action" onClick={onClick}>
      <img className="item-detail-action-icon" src={iconSrc} alt={altText} />
    </div>
  );
}
