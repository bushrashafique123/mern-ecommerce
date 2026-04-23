import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; 
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "@/services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

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

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await apiRequest({
          method: "post",
          endpoint: "/auth/users/reset-password",
          data: {
            email,
            newPassword: values.password,
            confirmPassword: values.confirmPassword,
          },
          successMessage: "Password reset successful",
          useToken: false,
        });

        if (res) {
          alert(res?.message || "Password reset successful");
          navigate("/login");
        }
      } catch (err) {
        alert("Error resetting password");
      } finally {
        setSubmitting(false);
      }
    },
  });

 
  if (!email) return null;

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
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full border p-2 rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {formik.errors.confirmPassword}
            </p>
          )}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-purple-500 text-white py-2 rounded disabled:opacity-50"
          >
            {formik.isSubmitting ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;