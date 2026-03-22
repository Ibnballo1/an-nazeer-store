import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Star,
  ShieldCheck,
  Leaf,
  ChevronRight,
  MessageCircle,
  Package,
  CheckCircle2,
  Sprout,
} from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/actions/products";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.metaTitle ?? product.name,
    description:
      product.metaDescription ?? product.shortDescription ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Fetch related products using categorySlug from the category relation
  // getProducts returns PaginatedResult — access .data for the array
  const categorySlug = product.category?.slug;

  const relatedResult = await getProducts({
    categorySlug,
    pageSize: 5, // fetch 5 so we can filter out current product and still have 4
  });

  const otherProducts = relatedResult.data
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Safely extract JSON fields
  const images: string[] = Array.isArray(product.images) ? product.images : [];
  const benefits: string[] = Array.isArray(product.benefits)
    ? product.benefits
    : [];

  // ingredients is a plain string in the schema, not an array
  const ingredientsText: string = product.ingredients ?? "";

  // Derive rating from reviews relation
  const reviews = product.reviews ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const isOutOfStock =
    product.trackInventory && !product.allowBackorder && product.stock === 0;

  const whatsappText = encodeURIComponent(
    `Hi! I'd like to order: ${product.name} (₦${Number(product.price).toLocaleString()}). Can you help me?`,
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-stone-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs text-stone-500">
              <Link href="/" className="hover:text-brand-green">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shop" className="hover:text-brand-green">
                Shop
              </Link>
              {product.category && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="hover:text-brand-green"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <ChevronRight className="w-3 h-3" />
              <span className="text-stone-800 font-medium line-clamp-1">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square bg-brand-cream rounded-2xl overflow-hidden">
                {images[0] ? (
                  <Image
                    src={images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sprout className="w-16 h-16 text-stone-300" />
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-border"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.isCertified && (
                  <span className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-green/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    NAFDAC Approved
                    {product.nafdacNumber ? ` · ${product.nafdacNumber}` : ""}
                  </span>
                )}
                {!isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title & Rating */}
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-900 mb-2 leading-tight">
                  {product.name}
                </h1>
                {avgRating && reviews.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(avgRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-stone-500">
                      {avgRating.toFixed(1)} ({reviews.length} review
                      {reviews.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-brand-green">
                  ₦{Number(product.price).toLocaleString()}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-stone-400 line-through">
                      ₦{Number(product.comparePrice).toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-700 text-sm font-semibold px-2 py-0.5 rounded-full">
                      {Math.round(
                        ((Number(product.comparePrice) -
                          Number(product.price)) /
                          Number(product.comparePrice)) *
                          100,
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>

              {/* Short description */}
              {product.shortDescription && (
                <p className="text-stone-600 text-base leading-relaxed border-l-2 border-brand-green/30 pl-4">
                  {product.shortDescription}
                </p>
              )}

              {/* Add to Cart */}
              <AddToCartButton
                productId={product.id}
                quantity={1}
                size="lg"
                fullWidth
                disabled={isOutOfStock}
              />

              {/* WhatsApp order */}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#22c35e] text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </a>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Leaf, label: "100% Natural" },
                  { icon: Package, label: "Fast Delivery" },
                  { icon: ShieldCheck, label: "Quality Assured" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex flex-col items-center gap-1.5 bg-stone-100 rounded-xl p-3 text-center"
                  >
                    <b.icon className="w-5 h-5 text-brand-green" />
                    <span className="text-xs font-medium text-stone-600">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details section */}
          <div className="mt-12 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900 mb-3">
                    Description
                  </h2>
                  <p className="text-stone-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-brand-green" />
                    Key Benefits
                  </h2>
                  <ul className="space-y-2.5">
                    {benefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-stone-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              {ingredientsText && (
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900 mb-3">
                    Ingredients
                  </h2>
                  <p className="text-stone-600 leading-relaxed text-sm">
                    {ingredientsText}
                  </p>
                </div>
              )}

              {/* How to use */}
              {product.usage && (
                <div className="bg-stone-50 rounded-xl p-5">
                  <h2 className="font-semibold text-stone-900 mb-2">
                    How to Use
                  </h2>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {product.usage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">
                Customer Reviews ({reviews.length})
              </h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl border border-stone-100 p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-semibold text-sm">
                          {review.reviewerName ?? "Anonymous"}
                        </p>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs text-brand-green">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-stone-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.body && (
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {review.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related products */}
          {otherProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {otherProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/shop/${p.slug}`}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm group hover:shadow-card transition-shadow"
                  >
                    <div className="aspect-square bg-stone-50 overflow-hidden relative">
                      {Array.isArray(p.images) && p.images[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sprout className="w-10 h-10 text-stone-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-stone-900 text-sm line-clamp-2 mb-1">
                        {p.name}
                      </h3>
                      <p className="text-brand-green font-bold text-sm">
                        ₦{Number(p.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
