import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "@/services/api";
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
        const res = await apiRequest({
          method: "post",
         endpoint: "/auth/users/request-reset",
          data: { email: values.email },
          successMessage: "OTP sent",
          useToken: false,
        });

        if (res) {
          alert(res.message);

          navigate("/verify-otp", {
            state: { email: values.email, type: "forgot" },
          });
        }
    } catch {
        alert("Error resetting password");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-black p-8 rounded-2xl shadow-xl w-full max-w-md">

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

          <button className="w-full bg-blue-500 text-black py-2 rounded">
            Send OTP
          </button>

        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;