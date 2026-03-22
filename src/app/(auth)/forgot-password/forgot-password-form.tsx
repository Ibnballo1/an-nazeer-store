"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    try {
      // BetterAuth uses resetPassword (client) which calls the reset endpoint
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast("If this email exists, a reset link has been sent.");
        return;
      }

      setSentEmail(values.email);
      setSubmitted(true);
    } catch (err) {
      toast(
        "Something went wrong, Please try again or contact us via WhatsApp.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="h-14 w-14 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-7 w-7 text-brand-green" />
        </div>
        <h3 className="font-semibold text-base mb-2">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a password reset link to{" "}
          <span className="font-medium text-foreground">{sentEmail}</span>.
          Check your inbox and click the link to reset your password.
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            onClick={() => setSubmitted(false)}
            className="text-brand-green hover:underline"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive">
            {form.formState.errors.email.message}
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
            Sending reset link…
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  );
}
