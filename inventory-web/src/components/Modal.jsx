import { useEffect, useRef } from "react";
import ModalWindow from "./ModalWindow";

// Full class strings so Tailwind can detect them at build time.
const COLORS = {
  green: "bg-green-600 hover:bg-green-700 shadow-green-400/40",
  red: "bg-red-600 hover:bg-red-700 shadow-red-400/40",
};

export default function Modal({
  open,
  onClose,
  onConfirm,
  header,
  text,
  buttonText = "Confirm",
  color = "green",
  focus = "confirm",
}) {
  const confirmRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    (focus === "cancel" ? cancelRef : confirmRef).current?.focus();
  }, [open, focus]);

  function handleConfirm() {
    onClose();
    onConfirm();
  }

  return (
    <ModalWindow open={open} onClose={onClose}>
      <h2 className="m-0 mb-3 text-2xl font-bold text-white">{header}</h2>
      <p className="text-center text-gray-300">{text}</p>
      <div className="mt-6 flex justify-around gap-4">
        <button
          ref={confirmRef}
          className={`px-4 py-2 font-semibold rounded-lg text-white shadow-lg ${COLORS[color]}`}
          onClick={handleConfirm}
        >
          {buttonText}
        </button>
        <button
          ref={cancelRef}
          className="px-4 py-2 font-semibold rounded-lg text-white bg-white/10 hover:bg-white/20 shadow-lg"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </ModalWindow>
  );
}
