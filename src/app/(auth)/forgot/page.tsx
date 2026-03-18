"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    try {
      await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/reset-password",
      });
      setSubmittedEmail(data.email);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <Link href="/login" className="flex items-center gap-2 group text-stone-600 hover:text-stone-900 transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm">Back to login</span>
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
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0f7a3a] to-[#0a5c2c] px-8 py-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-white mb-1">
                Reset Password
              </h1>
              <p className="text-white/70 text-sm">
                We'll send you a link to reset your password
              </p>
            </div>

            <div className="px-8 py-8">
              {submitted ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#0f7a3a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#0f7a3a]" />
                  </div>
                  <h2 className="font-semibold text-stone-900 text-lg mb-2">Check your inbox</h2>
                  <p className="text-stone-500 text-sm mb-6">
                    If <strong>{submittedEmail}</strong> is registered, you'll receive a reset link shortly. Check your spam folder if you don't see it.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-[#0f7a3a] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0a5c2c] transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                      Email address
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] ${
                        errors.email ? "border-red-300 bg-red-50" : "border-stone-200 bg-stone-50"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#0f7a3a] hover:bg-[#0a5c2c] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>

                  <p className="text-center text-sm text-stone-500">
                    Remember your password?{" "}
                    <Link href="/login" className="font-semibold text-[#0f7a3a] hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}