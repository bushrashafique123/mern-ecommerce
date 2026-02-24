import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './stripe';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Dashboard } from "./components/Dashboard";
import { Categories } from "./pages/Categories";
import { Products } from "./pages/Products";
import  AddCategory  from "./components/AddCategory";
import Users from "./pages/Users";
import Myprofile from "./pages/Myprofile";
import Setting from "./pages/Setting";
import Orders from "./pages/Orders";
import ProtectedRoute from "./routes/ProtectedRoute";

function RootRedirect() {
  const token = localStorage.getItem("token");
  return token
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },


  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          { index: true, element: <Categories /> },
          { path: "categories", element: <Categories /> },
          { path: "add-category", element: <AddCategory /> },
          { path: "products", element: <Products /> },
          { path: "orders", element: <Orders /> },
          { path: "users", element: <Users /> },
          { path: "account", element: <Myprofile /> },
          { path: "account/change-password", element: <Myprofile /> },
          { path: "settings", element: <Setting /> },
        ],
      },
    ],
  },

  // fallback
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <RouterProvider router={router} />
    </Elements>
  </StrictMode>
);
