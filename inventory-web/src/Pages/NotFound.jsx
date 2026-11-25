import { Link, useLocation } from "react-router";

const buttonBase =
  "rounded-lg px-5 py-3 font-semibold transition active:scale-[0.98]";

export default function NotFound({
  title = "Page not found",
  message = "The page you're looking for doesn't exist or was moved.",
  backTo,
  backLabel = "Go back",
}) {
  const { pathname } = useLocation();

  return (
    <main className="flex min-h-[80svh] flex-col items-center justify-center py-16 text-center">
      <p className="m-0 bg-gradient-to-b from-(--accent) to-transparent bg-clip-text text-[8rem] leading-none font-black tracking-tighter text-transparent select-none sm:text-[11rem]">
        404
      </p>

      <h1 className="mt-2 mb-0 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-lg text-gray-400">{message}</p>

      <code className="mt-4 rounded-md border border-(--border) bg-white/5 px-3 py-1 font-mono text-sm break-all text-gray-400">
        {pathname}
      </code>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className={`${buttonBase} bg-(--accent) text-white shadow-lg shadow-(--accent-bg) hover:brightness-110`}
        >
          Home
        </Link>
        {backTo && (
          <Link
            to={backTo}
            className={`${buttonBase} border border-(--border) text-gray-200 hover:border-(--accent-border) hover:bg-(--accent-bg)`}
          >
            {backLabel}
          </Link>
        )}
      </div>
    </main>
  );
}
