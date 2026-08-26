// src/app/(store)/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedProducts,
  getCategories,
  getBestSellerProducts,
  getProducts,
} from "@/lib/actions/products";
import { ProductCard } from "@/components/store/product-card";
import { SponsoredProductsCarousel } from "@/components/store/sponsored-products-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Leaf,
  Star,
  Truck,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { getActiveTestimonials } from "@/lib/actions/testimonials";
import { HeroCarousel } from "@/components/store/hero-carousel";
import { HorizontalScrollCarousel } from "@/components/store/horizontal-scroll-carousel";

export const metadata: Metadata = {
  title: "An-Nazeer Holistic Home | Natural Herbal Wellness Nigeria",
  description:
    "NAFDAC-approved herbal products, natural remedies, beauty solutions and health consultations. Shop online and get delivered across Nigeria.",
};

// Revalidate homepage every 1 minutes
export const revalidate = 60;

const sponsoredProducts = [
  {
    id: 1,
    img: "/images/sponsored/fibroid.jpeg",
    slug: "shop/fibroid-treatment",
  },
  {
    id: 2,
    img: "/images/sponsored/prostate.jpeg",
    slug: "shop/postrate-treatment",
  },
  {
    id: 3,
    img: "/images/sponsored/hepatitis.jpeg",
    slug: "shop/hepatitis-package",
  },
  {
    id: 4,
    img: "/images/sponsored/ovarian.jpeg",
    slug: "shop/ovarian-cyst-package",
  },
  {
    id: 5,
    img: "/images/sponsored/totalrelief.jpeg",
    slug: "shop/total-relief-formula",
  },
];

export default async function HomePage() {
  // Extract types from the functions themselves
  type ProductType = Awaited<ReturnType<typeof getFeaturedProducts>>[number];
  type CategoryType = Awaited<ReturnType<typeof getCategories>>[number];
  type TestimonialType = Awaited<
    ReturnType<typeof getActiveTestimonials>
  >[number];

  // Initialize with specific types instead of 'any'
  let featured: ProductType[] = [];
  let categories: CategoryType[] = [];
  let bestSellers: ProductType[] = [];
  let categoryProducts: Record<string, ProductType[]> = {};
  let testimonialsList: TestimonialType[] = [];
  try {
    // 2. Wrap the Promise.all in a try/catch
    const [featuredRes, categoriesRes, bestSellersRes, testimonialsRes] =
      await Promise.all([
        getFeaturedProducts(8).catch((e) => {
          console.error("Featured Error:", e);
          return [] as ProductType[];
        }),
        getCategories().catch((e) => {
          console.error("Categories Error:", e);
          return [] as CategoryType[];
        }),
        getBestSellerProducts(4).catch((e) => {
          console.error("Bestseller Error:", e);
          return [] as ProductType[];
        }),
        getActiveTestimonials(3).catch((e) => {
          console.error("Testimonial Error:", e);
          return [] as TestimonialType[];
        }),
      ]);

    featured = featuredRes;
    categories = categoriesRes;
    bestSellers = bestSellersRes;
    testimonialsList = testimonialsRes;
    // Fetch up to 4 products for the first few categories to show previews
    try {
        const catsToPreview = categories;
      const productsByCategory = await Promise.all(
        catsToPreview.map((c) =>
          getProducts({ categorySlug: c.slug, pageSize: 4 })
            .then((r) => r.data as ProductType[])
            .catch((e) => {
              console.error(`Category products error (${c.slug}):`, e);
              return [] as ProductType[];
            }),
        ),
      );

      categoryProducts = catsToPreview.reduce((acc, c, i) => {
        acc[c.slug] = productsByCategory[i] ?? [];
        return acc;
      }, {} as Record<string, ProductType[]>);
    } catch (err) {
      console.error("Failed to fetch category preview products:", err);
    }
  } catch (error) {
    // This catches catastrophic failures (like the DB connection being entirely down)
    console.error("Database connection failure:", error);
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-linear-to-br from-brand-green via-brand-green to-brand-green-dark overflow-hidden">
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
                className="border-white/40 text-white bg-brand-green hover:bg-white hover:text-brand-green rounded-xl h-12 px-6"
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
        <div className="absolute hidden md:block right-0 bottom-0 w-100 md:w-150 opacity-90">
          {/* <Image
            src="/seeds-hero.jpeg"
            alt="Spice Mix"
            width={600}
            height={600}
            className="object-contain"
          /> */}
          <HeroCarousel />
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

      {/* ── Sponsored Products ─────────────────────────────────────────────── */}
      <section
        className="relative py-12 md:py-16 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: "url('/naturebg.jpeg')" }}
      >
        {/* <div className="absolute inset-0 bg-[#f7f3ec]/55" /> */}
        <div className="container-safe relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1.95fr]">
            <div className="hidden lg:flex flex-col justify-between rounded-2xl bg-linear-to-br from-brand-green to-brand-green-dark p-8 text-white shadow-soft ring-8 ring-brand-cream overflow-hidden">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/90">
                  Sponsored Wellness
                </div>
                <div className="space-y-4">
                  <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                    Curated herbal solutions for every need
                  </h2>
                  <p className="text-sm md:text-base text-white/85 leading-relaxed">
                    Our sponsored products are handpicked to support natural
                    healing, trusted quality, and premium herbal wellness.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <SponsoredProductsCarousel products={sponsoredProducts} />
            </div>
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
      {/* <section className="py-12 md:py-16 bg-brand-cream"> */}
      <section
        className="py-12 md:py-16 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: "url('/naturebg.jpeg')" }}
      >
        <div className="container-safe">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Find exactly what your body needs
          </p>

          <div className="relative bg-brand-cream/70 rounded-2xl p-4">
            <HorizontalScrollCarousel
              ariaLabel="Shop by category"
              gap={16}
              arrowSize="md"
              contentClassName="gap-4 px-1"
            >
              {categories.slice(0, 6).map((cat) => {
                // Map category slug to a specific curated image
                // Falls back to a general herbal image for any unknown category
                const CATEGORY_IMAGES: Record<
                  string,
                  { image: string; alt: string }
                > = {
                  "remedies": {
                    image:
                      "/images/categories/remedy.jpeg",
                    alt: "Herbal tincture bottles with dried herbs",
                  },
                  "spices": {
                    image:
                      "/images/categories/spices.jpeg",
                    alt: "Colourful natural food spices",
                  },
                  "gorontula": {
                    image:
                      "/images/categories/skincare.jpeg",
                    alt: "Natural beauty and skincare products",
                  },
                  "oil": {
                    image:
                      "/images/categories/oils-cat.jpeg",
                    alt: "Holistic wellness products",
                  },
                  "seeds": {
                    image:
                      "/images/categories/seeds.jpeg",
                    alt: "Natural herbal aphrodisiac products",
                  },
                  "books": {
                    image:
                      "/images/categories/books.jpeg",
                    alt: "Islamic books and materials",
                  },
                };

                const media = CATEGORY_IMAGES[cat.slug] ?? {
                  image:
                    "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?w=600&q=80",
                  alt: "Natural herbal wellness products",
                };

                return (
                  <div key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className="group"
                    >
                      {/* Image */}
                      <div className="relative shrink-0 aspect-square w-48 md:w-56 lg:w-64">
                        <Image
                          src={media.image}
                          alt={media.alt}
                          fill
                          sizes="100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Dark gradient overlay for text legibility */}
                        {/* <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" /> */}

                        {/* Category name overlaid on image */}
                        
                        {/* Arrow icon — appears on hover */}
                        {/* <div className="absolute top-3 right-3 h-7 w-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:bg-brand-green">
                          <ArrowRight className="h-3.5 w-3.5 text-white" />
                        </div> */}
                      </div>
                    </Link>
                    <h3 className="font-semibold mt-4 text-center text-black text-sm leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                );
              })}
            </HorizontalScrollCarousel>
          </div>
        </div>
      </section>

      {/* ── Categories Products Preview ─────────────────────────────────────────────────── */}
      <section className="pb-12 md:pb-16 bg-white">
        <div className="container-safe">
          {categories.slice(0, 6).map((cat) => (          
              <div key={cat.id} className="relative bg-linear-to-br from-brand-green via-brand-green to-brand-green-dark rounded-2xl px-4 py-8 mt-6 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 z-0" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 z-0" />
                <div className="relative flex items-center justify-between mb-4 z-10">
                  <div>
                    <h2 className="font-display text-white text-xl md:text-2xl font-semibold">
                      Shop {cat.name}
                    </h2>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <Link href={`/shop?category=${cat.slug}`}>
                      View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                <hr className="h-0.75 w-full bg-brand-green-dark rounded-full mb-8"/>

                <div className="relative hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 z-10">
                  {(categoryProducts[cat.slug] ?? []).length > 0 ? (
                    (categoryProducts[cat.slug] ?? []).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-4 flex flex-col items-center gap-4">
                      <p className="text-white/90 text-center">Products coming soon.</p>
                      <Button asChild size="sm" className="bg-white text-brand-green">
                        <Link href={`/shop?category=${cat.slug}`}>Browse {cat.name}</Link>
                      </Button>
                    </div>
                  )}
                </div>

                <div className="relative sm:hidden">
                  <HorizontalScrollCarousel
                    ariaLabel={`Products in ${cat.name}`}
                    gap={16}
                    arrowSize="md"
                    contentClassName="gap-4 px-1"
                  >
                  {(categoryProducts[cat.slug] ?? []).length > 0 ? (
                    (categoryProducts[cat.slug] ?? []).map((product) => (
                      <div key={product.id} className="relative shrink-0 w-48 bg-black/5 rounded-2xl overflow-hidden">
                        <ProductCard product={product} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 flex flex-col items-center gap-4">
                      <p className="text-white/90 text-center">Products coming soon.</p>
                      <Button asChild size="sm" className="bg-white text-brand-green">
                        <Link href={`/shop?category=${cat.slug}`}>Browse {cat.name}</Link>
                      </Button>
                    </div>
                  )}
                  </HorizontalScrollCarousel>
                </div>

                <hr className="block sm:hidden h-0.75 w-full bg-brand-green-dark rounded-full my-8"/>

                <div className="flex justify-center sm:hidden">
                  <Button asChild variant="outline">
                    <Link href={`/shop?category=${cat.slug}`}>
                      View all <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
            </div>
          ))}
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
                  className="border-white/40 text-white bg-brand-green hover:bg-white hover:text-brand-green rounded-xl"
                >
                  <Link href="/contact#consultation">Free Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      {testimonialsList.length > 0 && (
        <section className="py-12 md:py-16 bg-brand-cream">
          <div className="container-safe">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-2">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-center mb-10 text-sm">
              Thousands of Nigerians trust An-Nazeer for their wellness
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonialsList.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl p-6 border border-border shadow-soft"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {/* Profile image or initial avatar */}
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-brand-green-light shrink-0 flex items-center justify-center border border-border">
                      {t.image ? (
                        <Image
                          src={t.image}
                          alt={t.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <span className="text-brand-green font-bold text-sm">
                          {t.name[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      {t.city && (
                        <p className="text-xs text-muted-foreground">
                          {t.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
