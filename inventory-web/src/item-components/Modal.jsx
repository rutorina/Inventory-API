import "./modal.css";
export default function Modal({ open, onClose, children }) {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex justify-center items-center transition-colors ${open ? "visible bg-black/50" : "invisible"}`}
    >
      {/* Modal */}
      <div
        className={`relative w-full max-w-md mx-4! bg-gray-700 text-gray-100 rounded-xl shadow-xl p-6! transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-2xl leading-none text-gray-400 hover:text-white"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
