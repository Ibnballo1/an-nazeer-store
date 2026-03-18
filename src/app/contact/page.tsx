"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { submitConsultation } from "@/lib/actions/consultation";
import { toast } from "sonner";

// ── Contact form ──────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactForm = z.infer<typeof contactSchema>;

// ── Consultation form ─────────────────────────────────────────────────────────
const consultSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  age: z.coerce.number().min(1).max(120).optional(),
  gender: z.string().optional(),
  healthChallenge: z
    .string()
    .min(20, "Please describe your health challenge in detail"),
  currentMedications: z.string().optional(),
  allergies: z.string().optional(),
});
type ConsultForm = z.infer<typeof consultSchema>;

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "consultation">(
    "contact",
  );
  const [contactSent, setContactSent] = useState(false);
  const [consultSent, setConsultSent] = useState(false);

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });
  const consultForm = useForm({
    resolver: zodResolver(consultSchema),
  });

  async function onContact(data: ContactForm) {
    await new Promise((r) => setTimeout(r, 800)); // simulate send
    setContactSent(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  }

  async function onConsult(data: ConsultForm) {
    try {
      await submitConsultation(data);
      setConsultSent(true);
      toast.success(
        "Consultation request submitted! Our practitioner will review it shortly.",
      );
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#0a5c2c] to-[#0f7a3a] py-14 relative overflow-hidden">
          <div className="absolute inset-0 leaf-bg opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
              Get in Touch
            </h1>
            <p className="text-white/70 text-lg">
              Questions, orders, or health consultations — we're here for you.
            </p>
          </div>
        </div>

        <div className="bg-stone-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left — contact info */}
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                  <h2 className="font-semibold text-stone-900 mb-5">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <a
                      href="tel:+2348000000000"
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-9 h-9 bg-[#0f7a3a]/10 rounded-xl flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-[#0f7a3a]" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 mb-0.5">Phone</p>
                        <p className="text-sm font-medium text-stone-900 group-hover:text-[#0f7a3a] transition-colors">
                          +234 800 000 0000
                        </p>
                      </div>
                    </a>
                    <a
                      href="mailto:info@annazeer.com"
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-9 h-9 bg-[#0f7a3a]/10 rounded-xl flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-[#0f7a3a]" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 mb-0.5">Email</p>
                        <p className="text-sm font-medium text-stone-900 group-hover:text-[#0f7a3a] transition-colors">
                          info@annazeer.com
                        </p>
                      </div>
                    </a>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-[#0f7a3a]/10 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#0f7a3a]" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 mb-0.5">
                          Location
                        </p>
                        <p className="text-sm font-medium text-stone-900">
                          Nigeria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000"}?text=${encodeURIComponent("Hello! I have a question about your products.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-2xl p-5 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Chat on WhatsApp</p>
                    <p className="text-white/80 text-xs">
                      Fastest response — usually within minutes
                    </p>
                  </div>
                </a>

                {/* Business hours */}
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                  <h3 className="font-semibold text-stone-900 mb-4 text-sm">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { day: "Monday – Friday", hours: "8:00 AM – 6:00 PM" },
                      { day: "Saturday", hours: "9:00 AM – 4:00 PM" },
                      { day: "Sunday", hours: "Closed" },
                    ].map((row) => (
                      <div
                        key={row.day}
                        className="flex justify-between text-stone-600"
                      >
                        <span>{row.day}</span>
                        <span className="font-medium text-stone-900">
                          {row.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — forms */}
              <div className="lg:col-span-2">
                {/* Tabs */}
                <div className="flex bg-stone-100 rounded-2xl p-1 mb-6">
                  <button
                    onClick={() => setActiveTab("contact")}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === "contact"
                        ? "bg-white shadow-sm text-stone-900"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    General Enquiry
                  </button>
                  <button
                    onClick={() => setActiveTab("consultation")}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      activeTab === "consultation"
                        ? "bg-white shadow-sm text-stone-900"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                    id="consultation"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    Health Consultation
                  </button>
                </div>

                {/* Contact form */}
                {activeTab === "contact" && (
                  <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8">
                    {contactSent ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-[#0f7a3a] mx-auto mb-3" />
                        <h3 className="font-display text-xl font-bold text-stone-900 mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-stone-500 mb-4">
                          We'll respond to you within 24 hours.
                        </p>
                        <button
                          onClick={() => setContactSent(false)}
                          className="text-[#0f7a3a] font-semibold text-sm hover:underline"
                        >
                          Send another message
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={contactForm.handleSubmit(onContact)}
                        className="space-y-4"
                      >
                        <h2 className="font-semibold text-stone-900 mb-2">
                          Send us a message
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                              Your name *
                            </label>
                            <input
                              {...contactForm.register("name")}
                              placeholder="Amina Yusuf"
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                              Email *
                            </label>
                            <input
                              {...contactForm.register("email")}
                              type="email"
                              placeholder="you@email.com"
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">
                            Phone (optional)
                          </label>
                          <input
                            {...contactForm.register("phone")}
                            type="tel"
                            placeholder="0801 234 5678"
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">
                            Message *
                          </label>
                          <textarea
                            {...contactForm.register("message")}
                            rows={5}
                            placeholder="How can we help you?"
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] resize-none"
                          />
                          {contactForm.formState.errors.message && (
                            <p className="text-red-500 text-xs mt-1">
                              {contactForm.formState.errors.message.message}
                            </p>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={contactForm.formState.isSubmitting}
                          className="flex items-center justify-center gap-2 bg-[#0f7a3a] hover:bg-[#0a5c2c] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
                        >
                          {contactForm.formState.isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Send Message
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Consultation form */}
                {activeTab === "consultation" && (
                  <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-8">
                    {consultSent ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-[#0f7a3a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Heart className="w-8 h-8 text-[#0f7a3a]" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-stone-900 mb-2">
                          Request Received!
                        </h3>
                        <p className="text-stone-500 max-w-sm mx-auto mb-4">
                          Our certified herbal practitioner will review your
                          case and respond within 24–48 hours.
                        </p>
                        <button
                          onClick={() => setConsultSent(false)}
                          className="text-[#0f7a3a] font-semibold text-sm hover:underline"
                        >
                          Submit another request
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={consultForm.handleSubmit(onConsult)}
                        className="space-y-4"
                      >
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
                          <p className="text-amber-800 text-xs leading-relaxed">
                            <strong>Note:</strong> This is a herbal wellness
                            consultation, not a replacement for medical care.
                            For emergencies, please contact a medical
                            professional immediately.
                          </p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                              Full name *
                            </label>
                            <input
                              {...consultForm.register("name")}
                              placeholder="Your full name"
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                              Email *
                            </label>
                            <input
                              {...consultForm.register("email")}
                              type="email"
                              placeholder="you@email.com"
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                              Phone
                            </label>
                            <input
                              {...consultForm.register("phone")}
                              type="tel"
                              placeholder="0801 234 5678"
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                              Age
                            </label>
                            <input
                              {...consultForm.register("age")}
                              type="number"
                              min={1}
                              max={120}
                              placeholder="Your age"
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1.5">
                              Gender
                            </label>
                            <select
                              {...consultForm.register("gender")}
                              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                            >
                              <option value="">Prefer not to say</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">
                            Describe your health challenge *
                          </label>
                          <textarea
                            {...consultForm.register("healthChallenge")}
                            rows={4}
                            placeholder="Please describe your symptoms, how long you've had them, and what you've tried..."
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] resize-none"
                          />
                          {consultForm.formState.errors.healthChallenge && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                consultForm.formState.errors.healthChallenge
                                  .message
                              }
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">
                            Current medications (if any)
                          </label>
                          <textarea
                            {...consultForm.register("currentMedications")}
                            rows={2}
                            placeholder="List any medications you're currently taking..."
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1.5">
                            Known allergies
                          </label>
                          <input
                            {...consultForm.register("allergies")}
                            placeholder="e.g. nuts, penicillin, or none known"
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={consultForm.formState.isSubmitting}
                          className="flex items-center justify-center gap-2 bg-[#0f7a3a] hover:bg-[#0a5c2c] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors disabled:opacity-60 text-sm"
                        >
                          {consultForm.formState.isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Heart className="w-4 h-4" />
                          )}
                          Submit Consultation Request
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
