import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-display text-2xl font-bold text-brand-green">
              🌿 An-Nazeer
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Holistic Home Ltd
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-border p-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold">
              Reset your password
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your new password below.
            </p>
          </div>

          {/* Suspense needed because ResetPasswordForm reads searchParams */}
          <Suspense
            fallback={
              <div className="h-32 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full border-2 border-brand-green border-t-transparent animate-spin" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
