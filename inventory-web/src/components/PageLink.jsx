import { Link } from "react-router";

export default function PageLink({ path, title, description }) {
  return (
    <Link
      to={path}
      className="group flex flex-col justify-between rounded-2xl border border-(--border) bg-(--surface) p-6 text-left shadow-(--shadow) transition duration-200 hover:-translate-y-1 hover:border-(--accent-border) hover:bg-(--accent-bg)"
    >
      <h3 className="m-0 text-2xl font-bold">{title}</h3>
      {description && <p className="mt-2 text-gray-400">{description}</p>}
      <span className="mt-6 text-sm font-semibold text-(--accent) transition group-hover:translate-x-1">
        Open →
      </span>
    </Link>
  );
}
