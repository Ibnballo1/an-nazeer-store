import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Leaf, Users, Heart } from "lucide-react";
import Image from "next/image";

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
                title: "Natural Remedies",
                desc: "Certified herbal remedies for common ailments and chronic conditions.",
                image:
                  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80",
                alt: "Glass bottles with herbal tinctures and dried herbs",
              },
              {
                title: "Food Spices",
                desc: "NAFDAC-approved pure natural spices that enhance flavour and health.",
                image:
                  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80",
                alt: "Colourful natural spices in wooden bowls",
              },
              {
                title: "Beauty Products",
                desc: "Chemical-free skincare and beauty products formulated from herbs.",
                image:
                  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
                alt: "Natural beauty skincare products with botanicals",
              },
              {
                title: "Wellness Solutions",
                desc: "Holistic products for energy, immunity, and overall wellbeing.",
                image:
                  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
                alt: "Wellness and holistic health products",
              },
              {
                title: "Gorontula Products",
                desc: "Premium Gorontula seed and syrup for vitality and health.",
                image:
                  "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&q=80",
                alt: "Natural seeds and herbal syrup bottles",
              },
              {
                title: "Herbal Business Training",
                desc: "Learn how to start and grow your own herbal wellness business.",
                image:
                  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
                alt: "Professional training and business workshop",
              },
              {
                title: "Health Consultations",
                desc: "One-on-one personalised consultations with our herbal wellness experts.",
                image:
                  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&q=80",
                alt: "Professional health consultation session",
              },
              {
                title: "Natural Aphrodisiacs",
                desc: "Safe, natural products to support vitality and reproductive health.",
                image:
                  "https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=600&q=80",
                alt: "Natural herbs and botanical wellness products",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Green overlay on hover */}
                  <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-brand-green transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
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
