import { Link } from "react-router";
import "../App.css";
export default function PageLink({ path, title }) {
  return (
    <Link
      to={path}
      className="min-w-50 max-w-75 min-h-25 p-4 m-2  text-black bg-(--link-color) rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center text-2xl font-bold"
    >
      <h3 className="page-link-title">{title}</h3>
    </Link>
  );
}
