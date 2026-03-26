import { Metadata } from "next";
import { ConsultationForm } from "./consultation-form";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Consultation",
  description:
    "Get in touch with An-Nazeer Holistic Home for consultations, orders, or general enquiries.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-cream py-12 border-b border-border">
        <div className="container-safe">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Contact & Consultation
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Have a question, need product advice, or want to book a health
            consultation? We&apos;re here to help.
          </p>
        </div>
      </section>

      <div className="container-safe py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">
              Get In Touch
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  label: "Phone / WhatsApp",
                  value: "+234 816 455 0066",
                  href: `tel:+2348164550066`,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "oriyomianaseer@gmail.com",
                  href: "mailto:oriyomianaseer@gmail.com",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value:
                    "Shop 664, Adura Bustop, Abeokuta Express Way, Beside Heyden Filling Station, Lagos",
                  // Adding a Google Maps search link makes it more functional
                  href: "https://www.google.com/maps/search/?api=1&query=Shop+664+Adura+bustop+abeokuta+express+way+beside+heyden+filling+station+lagos",
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="h-9 w-9 bg-brand-green-light rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={label === "Location" ? "_blank" : undefined}
                        rel={
                          label === "Location"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-sm font-medium hover:text-brand-green transition-colors leading-relaxed block max-w-[280px]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium leading-relaxed">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl hover:bg-[#25D366]/20 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
            <div>
              <p className="font-semibold text-sm">Chat on WhatsApp</p>
              <p className="text-xs text-muted-foreground">
                Get instant responses
              </p>
            </div>
          </a>

          {/* Business Hours */}
          <div className="bg-brand-cream rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-3">Business Hours</h3>
            <div className="space-y-1.5 text-sm">
              {[
                { day: "Mon – Fri", time: "8:00 AM – 6:00 PM" },
                { day: "Saturday", time: "9:00 AM – 4:00 PM" },
                { day: "Sunday", time: "Closed" },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between">
                  <span className="text-muted-foreground">{day}</span>
                  <span className="font-medium">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consultation Form */}
        <div className="lg:col-span-2" id="consultation">
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
            <h2 className="font-display text-xl font-semibold mb-1">
              Book a Consultation
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Fill in the form and our wellness experts will get back to you
              within 24 hours.
            </p>
            <ConsultationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
