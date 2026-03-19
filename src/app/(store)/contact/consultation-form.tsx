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
  subject: z.string().optional(),
  message: z.string().min(10, "Please describe your concern"),
  healthChallenge: z.string(),
  preferredContact: z.enum(["email", "phone", "whatsapp"]),
  preferredTime: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      healthChallenge: "",
      preferredContact: "whatsapp",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    const result = await submitConsultation(values);
    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error("Failed to submit consultation request 🌿");
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="h-12 w-12 text-brand-green mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold mb-2">
          Request Received!
        </h3>
        <p className="text-muted-foreground text-sm">
          Thank you! Our wellness expert will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Full name *</Label>
          <Input placeholder="Amina Ibrahim" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Email *</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Phone / WhatsApp</Label>
          <Input
            type="tel"
            placeholder="08012345678"
            {...form.register("phone")}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Preferred Contact *</Label>
          <select
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            {...form.register("preferredContact")}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Phone Call</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Subject</Label>
        <Input
          placeholder="e.g. Immune support, Weight management…"
          {...form.register("subject")}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Health challenge *</Label>
        <Textarea
          placeholder="Please describe your health challenge or what you'd like help with…"
          rows={4}
          className="rounded-xl resize-none"
          {...form.register("healthChallenge")}
        />
        {form.formState.errors.healthChallenge && (
          <p className="text-xs text-destructive">
            {form.formState.errors.healthChallenge.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Preferred time to be contacted</Label>
        <Input
          placeholder="e.g. Weekday mornings, Saturday afternoons…"
          {...form.register("preferredTime")}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-green hover:bg-brand-green-dark text-white rounded-xl h-11"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Submit Consultation Request"
        )}
      </Button>
    </form>
  );
}
