"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Leaf,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    if (!token) {
      toast.error("Invalid or expired reset link.");
      return;
    }
    try {
      await authClient.resetPassword({ newPassword: data.password, token });
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      toast.error("Failed to reset password. The link may have expired.");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <Link
          href="/login"
          className="flex items-center gap-2 group text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Back to login</span>
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0f7a3a] rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0f7a3a] to-[#0a5c2c] px-8 py-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">
                New Password
              </h1>
              <p className="text-white/70 text-sm">
                Choose a strong password for your account
              </p>
            </div>

            <div className="px-8 py-8">
              {!token ? (
                <div className="text-center">
                  <p className="text-stone-500 mb-4">
                    Invalid or missing reset token.
                  </p>
                  <Link
                    href="/forgot-password"
                    className="text-[#0f7a3a] font-semibold hover:underline text-sm"
                  >
                    Request a new reset link
                  </Link>
                </div>
              ) : done ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0f7a3a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#0f7a3a]" />
                  </div>
                  <h2 className="font-semibold text-stone-900 mb-2">
                    Password reset!
                  </h2>
                  <p className="text-stone-500 text-sm">
                    Redirecting you to login…
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPw ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${errors.password ? "border-red-300 bg-red-50" : "border-stone-200 bg-stone-50"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPw ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <input
                        {...register("confirmPassword")}
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat your new password"
                        className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-stone-200 bg-stone-50"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#0f7a3a] hover:bg-[#0a5c2c] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Resetting…
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
