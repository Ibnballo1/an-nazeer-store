"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitConsultation } from "@/lib/actions/consultation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  age: z.number().int().positive().optional().nullable(), // ✅ no coerce
  gender: z.string().optional().nullable(),
  message: z.string().min(10),
  healthChallenge: z.string().optional().nullable(),
  currentMedications: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
});

type FormValues = z.input<typeof schema>;

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      age: null,
      gender: "",
      message: "",
      healthChallenge: "",
      currentMedications: "",
      allergies: "",
    },
  });

  const { isSubmitting, errors } = form.formState;

  async function onSubmit(values: FormValues) {
    try {
      const result = await submitConsultation(values);

      if (result.success) {
        setSubmitted(true);
      } else {
        toast("Submission failed" + result.error);
      }
    } catch (err) {
      console.error("[ConsultationForm]", err);
      toast(
        "Something went wrong, Please try again or contact us via WhatsApp.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="h-16 w-16 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-brand-green" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">
          Request Received!
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Thank you! Our wellness expert will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
    >
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name *</Label>
          <Input
            id="name"
            placeholder="Amina Ibrahim"
            {...form.register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone + Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">
            Phone / WhatsApp{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="08012345678"
            {...form.register("phone")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="age">
            Age{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Input
            id="age"
            type="number" // ← change to number input
            min={1}
            max={120}
            placeholder="e.g. 35"
            {...form.register("age", { valueAsNumber: true })} // ← valueAsNumber
          />
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-1.5">
        <Label htmlFor="gender">
          Gender{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <select
          id="gender"
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...form.register("gender")}
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Main message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">What can we help you with? *</Label>
        <Textarea
          id="message"
          placeholder="Please describe what you'd like help with or any questions you have…"
          rows={4}
          className="rounded-xl resize-none"
          {...form.register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Health challenge */}
      <div className="space-y-1.5">
        <Label htmlFor="healthChallenge">
          Health challenge{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="healthChallenge"
          placeholder="e.g. High blood pressure, diabetes, infertility, low energy…"
          rows={2}
          className="rounded-xl resize-none"
          {...form.register("healthChallenge")}
        />
      </div>

      {/* Current medications + Allergies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentMedications">
            Current medications{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="currentMedications"
            placeholder="List any medications you are currently taking…"
            rows={2}
            className="rounded-xl resize-none"
            {...form.register("currentMedications")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="allergies">
            Allergies{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="allergies"
            placeholder="List any known allergies or sensitivities…"
            rows={2}
            className="rounded-xl resize-none"
            {...form.register("allergies")}
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-green hover:bg-brand-green-dark text-white rounded-xl h-11 mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending your request…
          </>
        ) : (
          "Submit Consultation Request"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        We typically respond within 24 hours. For urgent enquiries, please
        contact us directly via WhatsApp.
      </p>
    </form>
  );
}
