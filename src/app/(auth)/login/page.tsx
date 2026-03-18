"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { signIn } from "@/lib/authClient";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setIsLoading(true);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError("email", { message: "Invalid email or password" });
        setError("password", { message: "Invalid email or password" });
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 group text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Back to store</span>
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0f7a3a] rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-[#0f7a3a] text-sm hidden sm:block">
            An-Nazeer Holistic Home
          </span>
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            {/* Header strip */}
            <div className="bg-gradient-to-r from-[#0f7a3a] to-[#0a5c2c] px-8 py-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">
                Welcome back
              </h1>
              <p className="text-white/70 text-sm">
                Sign in to your An-Nazeer account
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-stone-200 bg-stone-50 hover:border-stone-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-stone-700"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#0f7a3a] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-stone-200 bg-stone-50 hover:border-stone-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0f7a3a] hover:bg-[#0a5c2c] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-stone-100" />
                <span className="text-xs text-stone-400">or</span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              {/* Guest checkout CTA */}
              <div className="bg-stone-50 rounded-2xl p-4 text-center mb-6">
                <p className="text-sm text-stone-600 mb-2">
                  Just want to buy something quickly?
                </p>
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-[#0f7a3a] hover:underline"
                >
                  Continue as guest →
                </Link>
              </div>

              {/* Register link */}
              <p className="text-center text-sm text-stone-500">
                Don't have an account?{" "}
                <Link
                  href={`/register${redirectTo !== "/" ? `?redirect=${redirectTo}` : ""}`}
                  className="font-semibold text-[#0f7a3a] hover:underline"
                >
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          {/* Trust note */}
          <p className="text-center text-xs text-stone-400 mt-6">
            🔒 Your data is secure and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
