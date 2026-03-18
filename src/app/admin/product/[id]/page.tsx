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
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ProductActions } from "@/components/shop/product-actions";
import { ProductGallery } from "@/components/shop/product-gallery";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getProducts({
    categoryId: product.categoryId ?? undefined,
    limit: 4,
  });
  const otherProducts = related.filter((p) => p.id !== product.id).slice(0, 4);

  const images: string[] = (product.images as string[]) ?? [];
  const benefits: string[] = (product.benefits as string[]) ?? [];
  const ingredients: string[] = (product.ingredients as string[]) ?? [];

  const whatsappText = encodeURIComponent(
    `Hi! I'd like to order: ${product.name} (₦${Number(product.price).toLocaleString()}). Can you help me?`,
  );

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20 min-h-screen bg-stone-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs text-stone-500">
              <Link href="/" className="hover:text-[#0f7a3a]">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/shop" className="hover:text-[#0f7a3a]">
                Shop
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-stone-800 font-medium line-clamp-1">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
            {/* Gallery */}
            <ProductGallery images={images} name={product.name} />

            {/* Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.isNafdacApproved && (
                  <span className="inline-flex items-center gap-1.5 bg-[#0f7a3a]/10 text-[#0f7a3a] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#0f7a3a]/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    NAFDAC Approved
                    {product.nafdacNumber && ` · ${product.nafdacNumber}`}
                  </span>
                )}
                {product.stock > 0 ? (
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

              {/* Title & rating */}
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-900 mb-2 leading-tight">
                  {product.name}
                </h1>
                {Number(product.reviewCount) > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(Number(product.rating))
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-stone-500">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-[#0f7a3a]">
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
                <p className="text-stone-600 text-base leading-relaxed border-l-2 border-[#0f7a3a]/30 pl-4">
                  {product.shortDescription}
                </p>
              )}

              {/* Add to cart / buy now */}
              <ProductActions
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: images[0] ?? "",
                  stock: product.stock,
                  slug: product.slug,
                }}
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
                    <b.icon className="w-5 h-5 text-[#0f7a3a]" />
                    <span className="text-xs font-medium text-stone-600">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <div className="mt-12 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="border-b border-stone-100">
              <div className="flex overflow-x-auto px-6 pt-4 gap-0">
                {["Description", "Benefits", "Ingredients & Usage"].map(
                  (tab, i) => (
                    <div
                      key={tab}
                      className={`px-5 py-3 text-sm font-semibold whitespace-nowrap cursor-default border-b-2 ${
                        i === 0
                          ? "border-[#0f7a3a] text-[#0f7a3a]"
                          : "border-transparent text-stone-500"
                      }`}
                    >
                      {tab}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="prose prose-stone prose-sm max-w-none">
                {product.description ? (
                  <p className="text-stone-600 leading-relaxed">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-stone-400 italic">
                    No description available.
                  </p>
                )}
              </div>

              {benefits.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#0f7a3a]" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-2.5">
                    {benefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-stone-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0f7a3a] shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ingredients.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold text-stone-900 mb-3">
                    Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="bg-[#0f7a3a]/8 text-[#0f7a3a] text-xs font-medium px-3 py-1.5 rounded-full border border-[#0f7a3a]/15"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.usage && (
                <div className="mt-8 bg-stone-50 rounded-xl p-5">
                  <h3 className="font-semibold text-stone-900 mb-2">
                    How to Use
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {product.usage}
                  </p>
                </div>
              )}
            </div>
          </div>

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
                    href={`/product/${p.slug}`}
                    className="product-card bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm group"
                  >
                    <div className="aspect-square bg-stone-50 overflow-hidden relative">
                      {(p.images as string[])?.[0] ? (
                        <Image
                          src={(p.images as string[])[0]}
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
                      <p className="text-[#0f7a3a] font-bold text-sm">
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
