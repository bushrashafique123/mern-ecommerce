import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import API from "@/api/axios";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, type } = location.state || {};

  if (!email) {
    navigate("/forgot-password");
  }

  const formik = useFormik({
    initialValues: {
      otp: "",
    },

    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await API.post("/auth/users/verify-otp", {
          email,
          otp: values.otp,
        });

        alert(res.data.message);

        if (type === "forgot") {
          navigate("/reset-password", { state: { email } });
        } else {
          navigate("/login");
        }

      } catch (err) {
        alert(err.response?.data?.message || "Invalid OTP");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-xl font-bold text-center mb-4">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4">
          OTP sent to {email}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            className="w-full border p-2 rounded text-center tracking-widest"
            onChange={formik.handleChange}
            value={formik.values.otp}
          />

          {formik.errors.otp && (
            <p className="text-red-500 text-sm">{formik.errors.otp}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Verify OTP
          </button>

        </form>

      </div>
    </div>
  );
};

export default VerifyOtp;