import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "@/api/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await API.post("/auth/users/request-reset", values);

        alert(res.data.message);

        navigate("/verify-otp", {
          state: { email: values.email, type: "forgot" },
        });

      } catch (err) {
        alert(err.response?.data?.message || "Error sending OTP");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-xl font-bold text-center mb-4">
          Forgot Password
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded"
            onChange={formik.handleChange}
            value={formik.values.email}
          />

          {formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Send OTP
          </button>

        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;