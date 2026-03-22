"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // BetterAuth appends the token as a query param
  const token = searchParams.get("token");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    if (!token) {
      toast(
        "Invalid link, This reset link is invalid or has expired. Please request a new one.",
      );
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      });

      if (error) {
        toast(
          error.message ??
            "Could not reset password. The link may have expired.",
        );
        return;
      }

      setDone(true);

      // Redirect to login after 3 seconds
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      toast(
        "Something went wrong, Please try again or request a new reset link.",
      );
    }
  }

  // No token in URL
  if (!token) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-4">
          This reset link is invalid or has expired.
        </p>
        <Button
          asChild
          className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
        >
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  // Success state
  if (done) {
    return (
      <div className="text-center py-4">
        <div className="h-14 w-14 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-brand-green" />
        </div>
        <h3 className="font-semibold text-base mb-2">Password reset!</h3>
        <p className="text-sm text-muted-foreground">
          Your password has been updated successfully. Redirecting you to sign
          in…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* New password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            {...form.register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="text-xs text-destructive">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your new password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-green hover:bg-brand-green-dark text-white rounded-xl h-11"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting password…
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}
