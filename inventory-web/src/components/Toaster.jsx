import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      toastOptions={{
        className:
          "px-8 !min-w-sm !bg-yellow-600 !text-white !border !border-slate-700 !rounded-xl !shadow-2xl",
        success: {
          className:
            "px-8 !min-w-sm  !bg-emerald-950 !text-emerald-200 !border-emerald-500",
        },
        error: {
          className:
            "px-8 !min-w-sm !bg-rose-950 !text-rose-200 !border-rose-500",
        },
      }}
    />
  );
}
