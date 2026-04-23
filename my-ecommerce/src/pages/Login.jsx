
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/slices/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
onSubmit: async (values, { resetForm }) => {
  try {
    const resultAction = await dispatch(login(values));

    if (login.fulfilled.match(resultAction)) {
      const { message } = resultAction.payload;

      if (message.includes("OTP")) {
        toast.success(message);
        navigate("/verify-otp", { state: { email: values.email, type: "login" } });
      } else {
        toast.success("Login successful!");
        navigate("/");
      }

      resetForm();
    } else {
      toast.error(resultAction.payload || resultAction.error.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
}
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            name="email"
            placeholder="Email"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <p>
            Not signed up yet?{" "}
            <Link to="/signup" className="text-yellow-500">Signup</Link>
          </p>
          <p>
            <Link to="/forgot-password" className="text-red-500">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;