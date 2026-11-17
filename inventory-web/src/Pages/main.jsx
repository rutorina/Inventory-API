import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./App.jsx";
import Items from "./Items.jsx";
import ItemDetails from "./itemDetails.jsx";
import Locations from "./Locations.jsx";
import LocationDetails from "./LocationDetails.jsx";

import Toaster from "../components/Toaster.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/items",
    element: <Items />,
  },
  {
    path: "/items/new",
    element: <div>New Item</div>,
  },
  {
    path: "/items/:id",
    element: <ItemDetails />,
  },
  {
    path: "/locations",
    element: <Locations />,
  },
  {
    path: "/locations/:id",
    element: <LocationDetails />,
  },
  {
    path: "/locations/:id/edit",
    element: <div>Edit Location</div>,
  },
  {
    path: "/stock/receive",
    element: <div>Receive Stock</div>,
  },
  {
    path: "/stock/transfer",
    element: <div>Transfer Stock</div>,
  },
  {
    path: "*",
    element: <div>Page Not Found</div>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
);
