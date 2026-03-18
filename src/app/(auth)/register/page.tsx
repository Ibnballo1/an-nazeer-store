"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Leaf,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { signUp } from "@/lib/authClient";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.string().email("Enter a valid email address"),
    phone: z
      .string()
      .regex(/^(\+?234|0)[789]\d{9}$/, "Enter a valid Nigerian phone number")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const PERKS = [
  "Track all your orders in one place",
  "Save your delivery addresses",
  "Get exclusive member offers",
  "Faster checkout every time",
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
  });

  const password = watch("password", "");
  const passwordStrength = getPasswordStrength(password);

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        if (result.error.message?.toLowerCase().includes("email")) {
          setError("email", { message: "This email is already registered" });
          toast.error("Email already in use");
        } else {
          toast.error(result.error.message ?? "Registration failed");
        }
        return;
      }

      toast.success("Account created! Welcome to An-Nazeer 🌿");
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
      <div className="flex-1 flex items-start justify-center px-4 py-8 lg:items-center">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left — perks (desktop only) */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-[#0f7a3a] to-[#0a5c2c] rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 leaf-bg opacity-20" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-display text-3xl font-bold mb-3">
                  Join An-Nazeer
                </h2>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Create a free account and enjoy a better wellness shopping
                  experience.
                </p>
                <ul className="space-y-4">
                  {PERKS.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-300 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-8 border-t border-white/20 flex items-center gap-3 text-sm text-white/60">
                  <span>🔒 SSL secured</span>
                  <span>·</span>
                  <span>Privacy protected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="px-8 pt-8 pb-2">
              <h1 className="font-display text-2xl font-bold text-stone-900 mb-1">
                Create your account
              </h1>
              <p className="text-stone-500 text-sm">
                It only takes a minute — free forever.
              </p>
            </div>

            <div className="px-8 py-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Amina Yusuf"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${
                      errors.name
                        ? "border-red-300 bg-red-50"
                        : "border-stone-200 bg-stone-50"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Email address <span className="text-red-500">*</span>
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
                        : "border-stone-200 bg-stone-50"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Phone number{" "}
                    <span className="text-stone-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    {...register("phone")}
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="0801 234 5678"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${
                      errors.phone
                        ? "border-red-300 bg-red-50"
                        : "border-stone-200 bg-stone-50"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-stone-200 bg-stone-50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              i <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-stone-100"
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${passwordStrength.textColor}`}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-stone-700 mb-1.5"
                  >
                    Confirm password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50"
                          : "border-stone-200 bg-stone-50"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms checkbox */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      {...register("agreeToTerms")}
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[#0f7a3a] focus:ring-[#0f7a3a] cursor-pointer"
                    />
                    <span className="text-xs text-stone-500 leading-relaxed">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-[#0f7a3a] hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-[#0f7a3a] hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      . I consent to receiving order updates via email.
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#0f7a3a] hover:bg-[#0a5c2c] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Create free account"
                  )}
                </button>
              </form>

              {/* Login link */}
              <p className="text-center text-sm text-stone-500 mt-6">
                Already have an account?{" "}
                <Link
                  href={`/login${redirectTo !== "/" ? `?redirect=${redirectTo}` : ""}`}
                  className="font-semibold text-[#0f7a3a] hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  textColor: string;
} {
  if (!password) return { score: 0, label: "", color: "", textColor: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    {
      score: 1,
      label: "Too weak",
      color: "bg-red-400",
      textColor: "text-red-600",
    },
    {
      score: 2,
      label: "Could be stronger",
      color: "bg-orange-400",
      textColor: "text-orange-600",
    },
    {
      score: 3,
      label: "Good password",
      color: "bg-yellow-400",
      textColor: "text-yellow-600",
    },
    {
      score: 4,
      label: "Strong password ✓",
      color: "bg-[#0f7a3a]",
      textColor: "text-[#0f7a3a]",
    },
  ];

  return levels[score - 1] ?? levels[0];
}
