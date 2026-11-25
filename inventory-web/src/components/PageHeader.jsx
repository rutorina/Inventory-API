import ReturnButton from "./ReturnButton.jsx";

/** Page title with an optional back button on the left and actions on the right. */
export default function PageHeader({ title, backTo, actions }) {
  return (
    <header className="relative flex min-h-24 items-center justify-center py-6">
      {backTo && (
        <div className="absolute left-0">
          <ReturnButton to={backTo} />
        </div>
      )}
      <h1 className="m-0 px-28 text-center text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      {actions && (
        <div className="absolute right-0 flex items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}
