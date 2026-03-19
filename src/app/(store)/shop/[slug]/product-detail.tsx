"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatNaira } from "@/lib/utils";
import {
  ShieldCheck,
  Leaf,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import type { Product, Review, Category } from "@/db/schema";

type ProductWithRelations = Product & {
  category: Category | null;
  reviews: Review[];
};

type Props = { product: ProductWithRelations };

export function ProductDetail({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const images = product.images?.length
    ? product.images
    : product.thumbnailUrl
      ? [product.thumbnailUrl]
      : [];

  const benefits = product.benefits ?? [];
  const isOOS =
    product.trackInventory && !product.allowBackorder && product.stock === 0;
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null;
  const whatsappMsg = encodeURIComponent(
    `Hello! I'd like to order: ${product.name} (₦${Number(product.price).toLocaleString()})`,
  );

  return (
    <div className="container-safe py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-brand-green">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-brand-green">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-brand-green"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* ── Image Gallery ─────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-brand-cream rounded-2xl overflow-hidden">
            {images[imgIdx] ? (
              <Image
                src={images[imgIdx]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl">
                🌿
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === imgIdx ? "border-brand-green" : "border-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ───────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Category + Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.category && (
              <Badge
                variant="outline"
                className="text-xs text-brand-green border-brand-green"
              >
                {product.category.name}
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-brand-green text-white text-xs">
                Bestseller
              </Badge>
            )}
            {product.isCertified && (
              <Badge className="bg-brand-green-light text-brand-green text-xs border-brand-green/20">
                <ShieldCheck className="h-3 w-3 mr-1" />
                NAFDAC Approved
              </Badge>
            )}
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {product.name}
          </h1>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="font-display text-3xl font-bold text-brand-green">
              {formatNaira(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-lg text-muted-foreground line-through pb-0.5">
                {formatNaira(product.comparePrice)}
              </span>
            )}
            {product.unit && (
              <span className="text-sm text-muted-foreground pb-0.5">
                / {product.unit}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          <Separator />

          {/* Quantity + Add to Cart */}
          {!isOOS ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-20">Quantity</span>
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) =>
                        product.trackInventory
                          ? Math.min(product.stock, q + 1)
                          : q + 1,
                      )
                    }
                    className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {product.trackInventory && (
                  <span className="text-xs text-muted-foreground">
                    {product.stock} in stock
                  </span>
                )}
              </div>

              <AddToCartButton
                productId={product.id}
                quantity={qty}
                size="lg"
                fullWidth
              />

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-[#25D366] text-[#25D366] font-medium hover:bg-[#25D366]/5 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </a>
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-muted-foreground">
                Out of Stock
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Contact us on WhatsApp to be notified when restocked.
              </p>
            </div>
          )}

          {/* NAFDAC number */}
          {product.nafdacNumber && (
            <p className="text-xs text-muted-foreground">
              NAFDAC Reg. No: {product.nafdacNumber}
            </p>
          )}
        </div>
      </div>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      {benefits.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-4">Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-brand-green-light rounded-xl"
              >
                <Leaf className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Description ───────────────────────────────────────────────────── */}
      {product.description && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-4">
            Description
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="leading-relaxed">{product.description}</p>
          </div>
        </section>
      )}

      {/* ── Ingredients / Usage ───────────────────────────────────────────── */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.ingredients && (
          <section className="bg-brand-cream rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Ingredients</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.ingredients}
            </p>
          </section>
        )}
        {product.usage && (
          <section className="bg-brand-cream rounded-2xl p-6">
            <h3 className="font-semibold mb-3">How to Use</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.usage}
            </p>
          </section>
        )}
      </div>

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      {product.reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-6">
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-border p-5"
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
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.body && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
