import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Bft } from "./pages/Bft";
import { Home } from "./pages/Home";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/bft",
    element: <Bft />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="mx-auto max-w-4xl px-2 pt-4 antialiased">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
