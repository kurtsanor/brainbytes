"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/api/auth.client";
import { useForm } from "react-hook-form";
import { SignUpFormValues, signUpSchema } from "@/schema/auth";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    const { confirmPassword, ...payload } = values;
    void confirmPassword;

    try {
      const response = await signUp(payload);
      reset();
      console.log(response);
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <form
      className="border border-neutral-200 w-115 flex flex-col bg-white p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Header */}
      <h1 className="text-xl font-bold mb-1 tracking-tight">Sign Up</h1>
      <p className="tracking-tight">
        Enter your email below to create an account
      </p>
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <p className="text-sm font-medium mt-4 mb-1.5">First name</p>
          <input
            {...register("firstName")}
            disabled={isSubmitting}
            type="text"
            placeholder="John"
            className={
              "border px-3 py-1.5 tracking-tight bg-neutral-50 border-neutral-200"
            }
          />
          {errors.firstName && (
            <span className="text-xs text-red-500 mt-1">
              {errors.firstName.message}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium mt-4 mb-1.5">Last name</p>
          <input
            {...register("lastName")}
            disabled={isSubmitting}
            type="text"
            placeholder="Doe"
            className={
              "border px-3 py-1.5 tracking-tight bg-neutral-50 border-neutral-200"
            }
          />
          {errors.lastName && (
            <span className="text-xs text-red-500 mt-1">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm font-medium mt-4 mb-1.5">Email</p>
      <input
        {...register("email")}
        disabled={isSubmitting}
        type="email"
        placeholder="you@example.com"
        className={
          "border px-3 py-1.5 tracking-tight bg-neutral-50 border-neutral-200"
        }
      />
      {errors.email && (
        <span className="text-xs text-red-500 mt-1">
          {errors.email.message}
        </span>
      )}
      <p className="text-sm font-medium mt-4 mb-1.5">Password</p>
      <input
        {...register("password")}
        disabled={isSubmitting}
        type="password"
        placeholder="Password"
        className={
          "border px-3 py-1.5 tracking-tight bg-neutral-50 border-neutral-200"
        }
      />
      {errors.password && (
        <span className="text-xs text-red-500 mt-1">
          {errors.password.message}
        </span>
      )}
      <p className="text-sm font-medium mt-4 mb-1.5">Confirm Password</p>
      <input
        {...register("confirmPassword")}
        disabled={isSubmitting}
        type="password"
        placeholder="Confirm Password"
        className={
          "border px-3 py-1.5 tracking-tight bg-neutral-50 border-neutral-200"
        }
      />
      {errors.confirmPassword && (
        <span className="text-xs text-red-500 mt-1">
          {errors.confirmPassword.message}
        </span>
      )}

      <Button
        isLoading={isSubmitting}
        loadingText="Creating account..."
        type="submit"
        className="bg-black hover:bg-neutral-900 text-white p-1.5 mt-3 tracking-tight transition-colors"
      >
        Create an account
      </Button>
      {/* Divider */}
      <div className="border-t border-neutral-200 my-6" />
      <p className="text-xs text-center text-muted-foreground">
        By signing up, you agree to the Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};

export default SignUpPage;
