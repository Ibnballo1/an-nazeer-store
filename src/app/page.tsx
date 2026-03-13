// src/app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Star,
  Shield,
  Award,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Sprout,
  Heart,
  Zap,
  MessageCircle,
} from "lucide-react";
import { getProducts, getCategories } from "@/lib/actions/products";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Footer } from "@/components/layout/footer";

const categories = [
  {
    name: "Herbs",
    slug: "herbs",
    emoji: "🌿",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    name: "Food Spices",
    slug: "food-spices",
    emoji: "🌶️",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    name: "Beauty Products",
    slug: "beauty-products",
    emoji: "✨",
    color: "bg-pink-50 text-pink-700 border-pink-200",
  },
  {
    name: "Natural Aphrodisiacs",
    slug: "natural-aphrodisiacs",
    emoji: "❤️",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  {
    name: "Gorontula Products",
    slug: "gorontula-products",
    emoji: "🌱",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    name: "Wellness Remedies",
    slug: "wellness-remedies",
    emoji: "💚",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
];

const testimonials = [
  {
    name: "Fatima A.",
    location: "Lagos",
    text: "The herbal products completely changed my health journey. I'm feeling better than I have in years!",
    rating: 5,
  },
  {
    name: "Chukwuemeka O.",
    location: "Abuja",
    text: "Their food spices are exceptional — NAFDAC approved and genuinely delicious. My whole family loves them.",
    rating: 5,
  },
  {
    name: "Adaeze N.",
    location: "Port Harcourt",
    text: "I consulted about my skin issues and the natural beauty products they recommended worked amazingly well.",
    rating: 5,
  },
];

const benefits = [
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "All products sourced from nature with no harmful chemicals or additives.",
  },
  {
    icon: Shield,
    title: "NAFDAC Approved",
    description:
      "Our food spices carry official NAFDAC certification for your safety.",
  },
  {
    icon: Award,
    title: "Expert Practitioner",
    description:
      "Products formulated by a certified GP trained by professional herbalists.",
  },
  {
    icon: Heart,
    title: "Proven Results",
    description:
      "Thousands of satisfied customers across Nigeria trust our remedies.",
  },
];

async function FeaturedProducts() {
  const products = await getProducts({ featured: true, limit: 4 });

  if (!products.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-64 skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="product-card bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm group"
        >
          <div className="aspect-square bg-stone-50 relative overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Sprout className="w-12 h-12 text-stone-300" />
              </div>
            )}
            {product.isNafdacApproved && (
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#0f7a3a] text-white px-2 py-0.5 rounded-full">
                NAFDAC
              </span>
            )}
          </div>
          <div className="p-3 md:p-4">
            <p className="text-xs text-stone-500 mb-1 truncate">
              {product.shortDescription}
            </p>
            <h3 className="font-semibold text-stone-900 text-sm mb-2 line-clamp-2 leading-snug">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0f7a3a] text-sm md:text-base">
                ₦{Number(product.price).toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₦{Number(product.comparePrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a5c2c] via-[#0f7a3a] to-[#166534]" />
        <div className="absolute inset-0 leaf-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a5c2c]/80 via-transparent to-transparent" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-0 w-72 h-72 md:w-96 md:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium px-4 py-2 rounded-full mb-6">
              <Award className="w-3.5 h-3.5" />
              Certified Herbal Practitioners · NAFDAC Approved
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Nature's Finest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                Wellness
              </span>{" "}
              Solutions
            </h1>

            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Discover authentic herbal remedies, natural beauty products, and
              NAFDAC-approved food spices crafted by certified practitioners for
              your holistic wellbeing.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0f7a3a] font-semibold px-8 py-4 rounded-full hover:bg-stone-50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I'd like to learn more about your products.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#22c35e] transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-10">
              {[
                "100% Natural",
                "5000+ Customers",
                "Certified Practitioners",
                "Fast Delivery",
              ].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 text-white/70 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#0f7a3a] text-sm font-semibold uppercase tracking-widest">
              Browse by Category
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mt-2">
              What We Offer
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`flex flex-col items-center gap-2 p-4 md:p-5 rounded-2xl border ${cat.color} hover:shadow-md transition-all group`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="text-xs font-semibold text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[#0f7a3a] text-sm font-semibold uppercase tracking-widest">
                Featured
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mt-2">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-[#0f7a3a] font-semibold text-sm hover:gap-2 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-64 skeleton" />
                ))}
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 bg-[#0f7a3a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-green-300 text-sm font-semibold uppercase tracking-widest">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
              The An-Nazeer Promise
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#0f7a3a] text-sm font-semibold uppercase tracking-widest">
                Our Story
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mt-2 mb-6">
                Rooted in Nature,
                <br />
                Guided by Expertise
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                An-Nazeer Holistic Home Ltd was founded with a singular mission:
                to bring the healing power of nature to every home in Nigeria.
                Led by a certified general practitioner trained by professional
                herbal specialists, we combine traditional knowledge with modern
                wellness science.
              </p>
              <p className="text-stone-600 leading-relaxed mb-8">
                From NAFDAC-approved food spices to potent herbal remedies,
                every product we offer is carefully selected and tested to
                ensure safety, efficacy, and quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-[#0f7a3a] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#0a5c2c] transition-colors"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-[#0f7a3a] text-[#0f7a3a] font-semibold px-6 py-3 rounded-full hover:bg-[#0f7a3a] hover:text-white transition-colors"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-3xl p-6 text-center">
                <div className="font-display text-4xl font-bold text-[#0f7a3a] mb-2">
                  5k+
                </div>
                <div className="text-stone-600 text-sm">Happy Customers</div>
              </div>
              <div className="bg-[#0f7a3a] rounded-3xl p-6 text-center">
                <div className="font-display text-4xl font-bold text-white mb-2">
                  100+
                </div>
                <div className="text-white/80 text-sm">Products</div>
              </div>
              <div className="bg-[#0f7a3a] rounded-3xl p-6 text-center">
                <div className="font-display text-4xl font-bold text-white mb-2">
                  10+
                </div>
                <div className="text-white/80 text-sm">Years Experience</div>
              </div>
              <div className="bg-stone-50 rounded-3xl p-6 text-center">
                <div className="font-display text-4xl font-bold text-[#0f7a3a] mb-2">
                  36
                </div>
                <div className="text-stone-600 text-sm">States Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0f7a3a] text-sm font-semibold uppercase tracking-widest">
              Reviews
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mt-2">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0f7a3a]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#0f7a3a] font-bold text-sm">
                      {t.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">
                      {t.name}
                    </div>
                    <div className="text-stone-500 text-xs">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#0f7a3a] to-[#0a5c2c] rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 leaf-bg opacity-20" />
            <div className="relative z-10">
              <Zap className="w-10 h-10 text-green-300 mx-auto mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Wellness Journey?
              </h2>
              <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
                Explore our full range of natural products and experience the
                difference that quality herbal solutions make.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white text-[#0f7a3a] font-bold px-8 py-4 rounded-full hover:bg-stone-50 transition-colors shadow-lg"
                >
                  Browse Products <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/25 transition-colors"
                >
                  Get a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
