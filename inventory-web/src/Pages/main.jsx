import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./App.jsx";
import Items from "./Items.jsx";
import ItemDetails from "./itemDetails.jsx";
import Locations from "./Locations.jsx";
import LocationDetails from "./LocationDetails.jsx";
import StockLevels from "./StockLevels.jsx";
import TransferStock from "./TransferStock.jsx";
import ReceiveStock from "./ReceiveStock.jsx";

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
    path: "/stock/receive",
    element: <ReceiveStock />,
  },
  {
    path: "/stock/transfer",
    element: <TransferStock />,
  },
  {
    path: "/stock/levels",
    element: <StockLevels />,
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
