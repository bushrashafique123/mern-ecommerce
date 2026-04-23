import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import API from "@/api/axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  if (!email) {
    navigate("/forgot-password");
  }

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await API.post("/auth/users/reset-password", {
          email,
          newPassword: values.password,
          confirmPassword: values.confirmPassword,
        });

        alert(res.data.message);

        navigate("/login");

      } catch (err) {
        alert(err.response?.data?.message || "Error resetting password");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-xl font-bold text-center mb-4">
          Reset Password
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          <input
            type="password"
            name="password"
            placeholder="New Password"
            className="w-full border p-2 rounded"
            onChange={formik.handleChange}
            value={formik.values.password}
          />

          {formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full border p-2 rounded"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
          />

          {formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {formik.errors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
          >
            Reset Password
          </button>

        </form>

      </div>
    </div>
  );
};

export default ResetPassword;