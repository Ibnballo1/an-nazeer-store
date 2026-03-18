import type { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  Award,
  Shield,
  Users,
  BookOpen,
  Heart,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about An-Nazeer Holistic Home Ltd — a certified herbal wellness brand run by a trained GP with NAFDAC-approved products.",
};

const values = [
  {
    icon: Leaf,
    title: "Natural Integrity",
    desc: "We never compromise on purity. Every product is sourced from nature without harmful additives.",
  },
  {
    icon: Shield,
    title: "Safety First",
    desc: "Our food spices carry NAFDAC certification. All products are tested for quality and safety.",
  },
  {
    icon: Heart,
    title: "Genuine Care",
    desc: "We treat every customer like family. Your health outcomes matter deeply to us.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Sharing",
    desc: "We train aspiring herbal practitioners, spreading wellness expertise across Nigeria.",
  },
];

const milestones = [
  { year: "2010", event: "An-Nazeer Holistic Home founded" },
  {
    year: "2014",
    event: "Obtained first NAFDAC approval for food spice range",
  },
  { year: "2017", event: "Expanded to beauty and wellness product lines" },
  { year: "2019", event: "Launched herbal practitioner training programme" },
  { year: "2022", event: "Reached 5,000+ satisfied customers nationwide" },
  { year: "2024", event: "Launched Gorontula product range" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0a5c2c] to-[#0f7a3a] py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 leaf-bg opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
              <Award className="w-3.5 h-3.5" />
              Certified Herbal Practitioners since 2010
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Our Story
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              From a passion for natural healing to one of Nigeria's most
              trusted herbal wellness brands — here's how An-Nazeer came to be.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#0f7a3a] text-sm font-semibold uppercase tracking-widest">
                  Who We Are
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-6">
                  Nature's Wisdom, Modern Trust
                </h2>
                <div className="space-y-4 text-stone-600 leading-relaxed">
                  <p>
                    An-Nazeer Holistic Home Ltd is a certified herbal and
                    natural health brand founded on the belief that nature
                    provides everything the human body needs to thrive. We
                    specialise in natural remedies, herbal products, food
                    spices, beauty products, wellness solutions, natural
                    aphrodisiacs, and our signature Gorontula products.
                  </p>
                  <p>
                    The brand is run by a certified general practitioner who
                    received rigorous training directly from professional herbal
                    practitioners. This blend of traditional knowledge and
                    modern understanding sets An-Nazeer apart in the Nigerian
                    wellness landscape.
                  </p>
                  <p>
                    Our food spices hold{" "}
                    <strong className="text-stone-900">
                      NAFDAC certification
                    </strong>
                    , giving our customers the assurance that every product
                    meets Nigeria's highest food safety standards.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0f7a3a]/5 border border-[#0f7a3a]/10 rounded-3xl p-6 text-center">
                  <div className="font-display text-5xl font-bold text-[#0f7a3a] mb-2">
                    5k+
                  </div>
                  <div className="text-stone-600 text-sm font-medium">
                    Customers Served
                  </div>
                </div>
                <div className="bg-[#0f7a3a] rounded-3xl p-6 text-center">
                  <div className="font-display text-5xl font-bold text-white mb-2">
                    100+
                  </div>
                  <div className="text-white/80 text-sm font-medium">
                    Products
                  </div>
                </div>
                <div className="bg-[#0f7a3a] rounded-3xl p-6 text-center">
                  <div className="font-display text-5xl font-bold text-white mb-2">
                    14
                  </div>
                  <div className="text-white/80 text-sm font-medium">
                    Years Experience
                  </div>
                </div>
                <div className="bg-[#0f7a3a]/5 border border-[#0f7a3a]/10 rounded-3xl p-6 text-center">
                  <div className="font-display text-5xl font-bold text-[#0f7a3a] mb-2">
                    36
                  </div>
                  <div className="text-stone-600 text-sm font-medium">
                    States Reached
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#0f7a3a] text-sm font-semibold uppercase tracking-widest">
                What We Stand For
              </span>
              <h2 className="font-display text-3xl font-bold text-stone-900 mt-2">
                Our Core Values
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#0f7a3a]/10 rounded-2xl flex items-center justify-center mb-4">
                    <v.icon className="w-6 h-6 text-[#0f7a3a]" />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-2">{v.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NAFDAC section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0f7a3a]/5 to-[#0a5c2c]/5 border border-[#0f7a3a]/15 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#0f7a3a] rounded-2xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-stone-900">
                        NAFDAC Approved
                      </h2>
                      <p className="text-stone-500 text-sm">
                        National Agency for Food & Drug Administration
                      </p>
                    </div>
                  </div>
                  <p className="text-stone-600 leading-relaxed mb-6">
                    Our food spice range has received official NAFDAC
                    certification, Nigeria's highest food safety standard. This
                    means every spice you purchase from us has been
                    independently tested and approved for safe consumption by
                    the national regulatory authority.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Independently laboratory-tested",
                      "Meets all Nigerian food safety standards",
                      "Free from harmful additives and preservatives",
                      "Authentic, traceable ingredients",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-stone-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0f7a3a] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-stone-100">
                  <div className="w-20 h-20 bg-[#0f7a3a] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="font-display text-xl font-bold text-stone-900 mb-2">
                    NAFDAC Certified
                  </div>
                  <div className="text-stone-500 text-sm mb-4">
                    Food Spice Range
                  </div>
                  <div className="bg-[#0f7a3a]/10 text-[#0f7a3a] text-xs font-semibold px-4 py-2 rounded-full inline-block">
                    Verified Safe for Consumption
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training programme */}
        <section className="py-16 md:py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-[#0f7a3a] text-sm font-semibold uppercase tracking-widest">
                  Knowledge Sharing
                </span>
                <h2 className="font-display text-3xl font-bold text-stone-900 mt-2 mb-4">
                  Herbal Business Training
                </h2>
                <p className="text-stone-600 leading-relaxed mb-6">
                  Beyond selling products, An-Nazeer is committed to growing the
                  herbal wellness industry in Nigeria. We offer training
                  programmes for individuals who want to start their own herbal
                  businesses, sharing the knowledge and expertise we've built
                  over more than a decade.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Hands-on herbal product formulation",
                    "Business setup and regulatory compliance",
                    "NAFDAC registration guidance",
                    "Marketing and customer acquisition",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-stone-600"
                    >
                      <div className="w-5 h-5 bg-[#0f7a3a] rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#0f7a3a] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#0a5c2c] transition-colors"
                >
                  Enquire About Training <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-stone-700 text-sm mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0f7a3a]" />
                  Our Journey
                </h3>
                {milestones.map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-[#0f7a3a] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-[10px] font-bold">
                          {m.year}
                        </span>
                      </div>
                      {i < milestones.length - 1 && (
                        <div className="w-0.5 flex-1 bg-stone-200 my-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-stone-700 text-sm font-medium mt-2.5">
                        {m.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#0f7a3a]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Start Your Wellness Journey Today
            </h2>
            <p className="text-white/70 mb-8">
              Explore our range of certified natural products or reach out for a
              personal consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0f7a3a] font-bold px-8 py-4 rounded-full hover:bg-stone-50 transition-colors"
              >
                Shop Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/25 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
