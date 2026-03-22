import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Leaf, Users, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about An-Nazeer Holistic Home Ltd — Nigeria's trusted herbal wellness brand.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-green py-16 md:py-24 text-white">
        <div className="container-safe max-w-3xl text-center">
          <p className="text-white/60 text-sm mb-3">Our Story</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Healing Through Nature
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            An-Nazeer Holistic Home Ltd is Nigeria&apos;s leading herbal
            wellness brand, dedicated to making natural health solutions
            accessible to every Nigerian household.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 md:py-20">
        <div className="container-safe max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe that nature holds the key to true wellness. Our
                mission is to bridge the gap between traditional African herbal
                knowledge and modern health science — delivering products that
                are safe, effective, and accessible to all Nigerians.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every product we create is carefully sourced, rigorously tested,
                and approved by NAFDAC — because your health is our highest
                responsibility.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  label: "NAFDAC Approved",
                  desc: "All products certified",
                },
                {
                  icon: Leaf,
                  label: "100% Natural",
                  desc: "No harmful additives",
                },
                {
                  icon: Users,
                  label: "10,000+ Customers",
                  desc: "Across Nigeria",
                },
                {
                  icon: Heart,
                  label: "Wellness First",
                  desc: "Your health matters",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="bg-brand-green-light rounded-2xl p-5"
                >
                  <Icon className="h-6 w-6 text-brand-green mb-3" />
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 bg-brand-cream">
        <div className="container-safe">
          <h2 className="font-display text-3xl font-semibold text-center mb-2">
            What We Offer
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Comprehensive wellness solutions for every need
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                emoji: "🌿",
                title: "Natural Remedies",
                desc: "Certified herbal remedies for common ailments and chronic conditions.",
              },
              {
                emoji: "🌶",
                title: "Food Spices",
                desc: "NAFDAC-approved pure natural spices that enhance flavour and health.",
              },
              {
                emoji: "✨",
                title: "Beauty Products",
                desc: "Chemical-free skincare and beauty products formulated from herbs.",
              },
              {
                emoji: "💚",
                title: "Wellness Solutions",
                desc: "Holistic products for energy, immunity, and overall wellbeing.",
              },
              {
                emoji: "🌰",
                title: "Gorontula Products",
                desc: "Premium Gorontula seed and syrup for vitality and health.",
              },
              {
                emoji: "📚",
                title: "Herbal Business Training",
                desc: "Learn how to start and grow your own herbal wellness business.",
              },
              {
                emoji: "🏥",
                title: "Health Consultations",
                desc: "One-on-one personalised consultations with our herbal wellness experts.",
              },
              {
                emoji: "🔬",
                title: "Natural Aphrodisiacs",
                desc: "Safe, natural products to support vitality and reproductive health.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-6 border border-border"
              >
                <div className="text-3xl mb-3">{s.emoji}</div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="container-safe text-center max-w-2xl">
          <h2 className="font-display text-3xl font-semibold mb-4">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-muted-foreground mb-8">
            Browse our products or book a free consultation with our wellness
            experts.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
            >
              <Link href="/shop">Shop Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <Link href="/contact#consultation">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
