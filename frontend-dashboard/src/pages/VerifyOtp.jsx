import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "@/services/api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, type } = location.state || {};

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

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
        const res = await apiRequest({
          method: "post",
          endpoint: "/auth/users/verify-otp",
          data: {
            email,
            otp: values.otp,
          },
          successMessage: "OTP verified",
          useToken: false,
        });

        if (res) {
          alert(res.message);

          if (type === "forgot") {
            navigate("/reset-password", { state: { email } });
          } else {
            navigate("/login");
          }
        }
      } catch {
        alert("Invalid OTP");
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
            className="w-full border p-2 rounded text-center"
            onChange={formik.handleChange}
            value={formik.values.otp}
          />

          {formik.errors.otp && (
            <p className="text-red-500 text-sm">{formik.errors.otp}</p>
          )}

          <button className="w-full bg-green-500 text-black py-2 rounded">
            Verify OTP
          </button>

        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;