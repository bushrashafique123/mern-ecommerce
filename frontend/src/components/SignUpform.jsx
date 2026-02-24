import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import BoxLoader from "../utils/BoxLoader";
import { useState } from "react";

export function SignUpform({ className, ...props }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);

    const response = await apiRequest({
      method: 'post',
      endpoint: '/auth/users/register',
      data: formData,
      successMessage: 'User created successfully!',
      useToken: false,
    });

    setLoading(false);

    // Optional: redirect or show confirmation
    if (response) {
      // e.g., navigate("/login")
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {loading && <BoxLoader message="Creating your account..." />}

              <div className="flex flex-col gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

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

                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    {...register("confirmPassword", { required: "Please confirm your password" })}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="3454543964"
                    {...register("phone", { required: "Phone number is required" })}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Quetta"
                    {...register("address", { required: "Address is required" })}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Sign Up"}
              </Button>
            </div>

            <div className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to='/login' className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}