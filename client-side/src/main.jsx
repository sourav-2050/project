 import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "./index.css";

import Root from "./Components/Root";
import Home from "./Components/Home";
import About from "./Components/About";
import Information from "./Components/Information";
import DonarForm from "./Components/DonarForm";
import Admin from "./Components/Admin";
import AvailableDonar from "./Components/AvailableDonar";
import SearchDonar from "./Components/SearchDonar";
import AdminControl from "./Components/AdminControl";
import PrivateRoute from "./Components/PrivateRouter";

import { AdminProvider } from "./context/AdminContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,

    children: [
      {
        index: true,
        Component: Home,
      },

      {
        path: "/about",
        Component: About,
      },

      {
        path: "/information",
        Component: Information,
      },

      {
        path: "/donarForm",
        Component: DonarForm,
      },

      {
        path: "/admin",
        Component: Admin,
      },

      {
        path: "/available",
        Component: AvailableDonar,
        loader: () =>
          fetch("http://localhost:3000/users"),
      },

      {
        path: "/searchDonar",
        Component: SearchDonar,
        loader: () =>
          fetch("http://localhost:3000/users"),
      },

      {
        path: "/adminControl",

        element: (
          <PrivateRoute>
            <AdminControl />
          </PrivateRoute>
        ),

        loader: () =>
          fetch("http://localhost:3000/users"),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <RouterProvider router={router} />
    </AdminProvider>
  </StrictMode>
);