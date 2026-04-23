// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  if (!token || !isAuthenticated) {

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;