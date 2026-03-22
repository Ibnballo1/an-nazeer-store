// src/app/(store)/page.tsx

import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedProducts,
  getCategories,
  getBestSellerProducts,
} from "@/lib/actions/products";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Leaf,
  Star,
  Truck,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "An-Nazeer Holistic Home | Natural Herbal Wellness Nigeria",
  description:
    "NAFDAC-approved herbal products, natural remedies, beauty solutions and health consultations. Shop online and get delivered across Nigeria.",
};

// Revalidate homepage every 1 minutes
export const revalidate = 60;

export default async function HomePage() {
  const [featured, categories, bestSellers] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getBestSellerProducts(4),
  ]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-brand-green via-brand-green to-brand-green-dark overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="container-safe relative py-16 md:py-24 lg:py-32">
          <div className="max-w-2xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4 text-xs">
              🌿 NAFDAC Certified Products
            </Badge>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Nature&apos;s Best.
              <br />
              <span className="text-white/80">Delivered to You.</span>
            </h1>

            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Premium herbal remedies, wellness products, and natural beauty
              solutions — crafted with care and approved by NAFDAC.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-brand-green hover:bg-white/90 font-semibold rounded-xl h-12 px-6"
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 rounded-xl h-12 px-6"
              >
                <Link href="/contact#consultation">Book Consultation</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 mt-10">
              {[
                { icon: ShieldCheck, label: "NAFDAC Approved" },
                { icon: Leaf, label: "100% Natural" },
                { icon: Truck, label: "Nigeria-wide Delivery" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-white/70"
                >
                  <Icon className="h-4 w-4 text-white/60" />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Strip ────────────────────────────────────────────────── */}
      <section className="bg-brand-cream border-b border-border">
        <div className="container-safe py-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            <Link
              href="/shop"
              className="shrink-0 px-4 py-2 rounded-full bg-brand-green text-white text-sm font-medium"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="shrink-0 px-4 py-2 rounded-full bg-white border border-border text-sm font-medium text-foreground hover:border-brand-green hover:text-brand-green transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits Strip ────────────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="container-safe">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              {
                icon: ShieldCheck,
                title: "NAFDAC Certified",
                desc: "All products verified",
              },
              {
                icon: Leaf,
                title: "100% Natural",
                desc: "No harmful chemicals",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Nationwide shipping",
              },
              {
                icon: Star,
                title: "5-Star Rated",
                desc: "Trusted by thousands",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-5 gap-2"
              >
                <div className="h-10 w-10 bg-brand-green-light rounded-xl flex items-center justify-center">
                  <Icon className="h-5 w-5 text-brand-green" />
                </div>
                <p className="font-semibold text-sm text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container-safe">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold">
                Featured Products
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Our bestselling herbal wellness products
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <Link href="/shop">
                View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              Products coming soon.
            </p>
          )}

          <div className="mt-8 flex justify-center sm:hidden">
            <Button asChild variant="outline">
              <Link href="/shop">View all products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Bestsellers ───────────────────────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="py-12 md:py-16 bg-brand-cream">
          <div className="container-safe">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold">
                  Bestsellers
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Our most loved products
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Link href="/shop?sort=popular">
                  View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Categories Grid ───────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-brand-cream">
        <div className="container-safe">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Find exactly what your body needs
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.slice(0, 6).map((cat, i) => {
              const EMOJIS = ["🌿", "🌶", "✨", "💚", "🌰", "🏥"];
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative bg-white rounded-2xl p-6 border border-border hover:border-brand-green hover:shadow-soft transition-all duration-200"
                >
                  <div className="text-3xl mb-3">{EMOJIS[i] ?? "🌿"}</div>
                  <h3 className="font-semibold text-foreground group-hover:text-brand-green transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                  <ArrowRight className="h-4 w-4 text-brand-green absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About Preview ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="container-safe">
          <div className="bg-brand-green rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-2xl">
              <Badge className="bg-white/20 text-white border-white/30 mb-4 text-xs">
                Our Story
              </Badge>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Rooted in Nature, Guided by Science
              </h2>
              <p className="text-white/80 leading-relaxed mb-6">
                An-Nazeer Holistic Home Ltd was founded with a singular mission:
                to bring the healing power of nature to every Nigerian home. Our
                products are carefully sourced, NAFDAC-approved, and formulated
                to deliver real results you can feel.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-white text-brand-green hover:bg-white/90 rounded-xl"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 rounded-xl"
                >
                  <Link href="/contact#consultation">Free Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-brand-cream">
        <div className="container-safe">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-2">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            Thousands of Nigerians trust An-Nazeer for their wellness
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Fatimah A.",
                city: "Lagos",
                rating: 5,
                text: "The Gorontula syrup has been a game changer for my energy levels. I feel so much better after just two weeks!",
              },
              {
                name: "Chukwuemeka O.",
                city: "Abuja",
                rating: 5,
                text: "I ordered the immune boost blend and my family has not fallen sick since. Fast delivery too — got it in two days!",
              },
              {
                name: "Amina M.",
                city: "Kano",
                rating: 5,
                text: "The herbal consultation was incredibly helpful. They truly understand wellness holistically. I recommend to everyone.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 border border-border shadow-soft"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ──────────────────────────────────────────────────── */}
      <section className="py-10 border-t border-border">
        <div className="container-safe text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Need help choosing the right product?
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I need help choosing a product.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Chat with an Expert on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
