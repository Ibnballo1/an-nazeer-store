import { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card border border-border p-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold">
              Forgot your password?
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          <ForgotPasswordForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link
              href="/login"
              className="text-brand-green font-medium hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
