import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {Card,CardContent,CardHeader, CardTitle,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "../services/api"; 
import BoxLoader from "../utils/BoxLoader"; 
import {saveToken} from '../helper/auth'

import { Toaster } from "./ui/toaster";
import { useState } from "react";

export function Loginform({ className, ...props }) {
 
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

//   const onSubmit = async (formData) => {
//     setLoading(true);
//     setError(null);

//     const response = await apiRequest({
//       method: 'post',
//       endpoint: '/auth/users/login',
//       data: formData,
//       successMessage: 'Login successful!',
//       useToken: false, 
//     });

//     setLoading(false);

//    if (response?.token) {
//   localStorage.setItem("token", response.token);
//   console.log(response.token)
//   navigate("/dashboard");
// } else {
//   setError("Token is missing in the server response.");
// } 
//   };

const onSubmit = async (formData) => {
  setLoading(true);
  setError(null);
  console.log('Login attempt with:', formData);

  const response = await apiRequest({
    method: "post",
    endpoint: "/auth/users/login",
    data: formData,
    useToken: false,
  });

  setLoading(false);

  console.log('Login response:', response);

  if (!response?.token) {
    console.error('Login failed - no token in response');
    setError("Login failed");
    return;
  }

  console.log('Token received:', response.token);
  saveToken(response.token);
  console.log('Token saved to localStorage');
  navigate("/dashboard", { replace: true });
};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {loading && <BoxLoader message="Logging you in..." />}
              <div className="flex flex-col gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
              </div>
              <Button type="submit" disabled={loading}> {loading ? "Submitting..." : "log in"}</Button>
            </div>
            {error && <div className="mt-4 text-red-500">{error}</div>}
            <div className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <Link to='/signup' className="underline underline-offset-4">
                Sign up
              </Link>
                  <Link to="/forgot-password" className="text-red-500">Forgot Password?</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}