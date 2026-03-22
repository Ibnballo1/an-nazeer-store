import { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your An-Nazeer account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <div className="w-full max-w-md">
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
              Create your account
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Join thousands of wellness-conscious Nigerians
            </p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-green font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Or{" "}
          <Link href="/shop" className="text-brand-green hover:underline">
            continue shopping as guest
          </Link>
        </p>
      </div>
    </div>
  );
}
