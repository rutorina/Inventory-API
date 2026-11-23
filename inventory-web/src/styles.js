// Shared Tailwind class strings, so every page looks the same.

export const cardClass =
  "rounded-2xl border border-(--border) bg-(--surface) shadow-(--shadow)";

export const labelClass =
  "block text-sm font-semibold uppercase tracking-wide text-gray-400 mb-2";

export const fieldClass =
  "w-full rounded-lg border border-(--border) bg-white/5 px-4 py-3 text-lg text-white " +
  "placeholder:text-gray-500 outline-none transition " +
  "focus:border-(--accent) focus:ring-2 focus:ring-(--accent-bg)";

export const iconButtonClass =
  "group flex size-10 items-center justify-center rounded-full transition hover:bg-(--accent-bg)";

export const iconImageClass =
  "h-7 w-auto transition duration-200 group-hover:scale-110 " +
  "group-hover:drop-shadow-[0_4px_8px_rgb(156,7,255)]";
