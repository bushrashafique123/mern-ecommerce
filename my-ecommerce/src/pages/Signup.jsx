import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "@/api/axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Too short").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
       try {
        setLoading(true);

        const res = await API.post("/auth/users/register", values);
        alert("✅ Signup successful! Please verify OTP");

        navigate("/verify-otp", {
          state: { email: values.email, type: "signup" },
        });

        resetForm();

      } catch (err) {
        console.error("Signup error:", err); 
        const message =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong";

        alert("❌ " + message);

      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* Name */}
          <input name="name" placeholder="Full Name"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          {/* Email */}
          <input name="email" placeholder="Email"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          {/* Password */}
          <input type="password" name="password" placeholder="Password"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          {/* Confirm Password */}
          <input type="password" name="confirmPassword" placeholder="Confirm Password"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
          )}

          {/* Phone */}
          <input name="phone" placeholder="Phone Number"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm">{formik.errors.phone}</p>
          )}

          {/* Address */}
          <input name="address" placeholder="Address"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-sm">{formik.errors.address}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

        </form>

        {/* Links */}
        <div className="text-center mt-4 space-y-2">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">Login</Link>
          </p>

          <p>
            <Link to="/forgot-password" className="text-red-500">
              Forgot Password?
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;