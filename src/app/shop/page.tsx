// src/app/shop/page.tsx
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ShopContent } from "@/components/shop/shop-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Natural & Herbal Products",
  description:
    "Browse our full range of natural remedies, herbal products, NAFDAC-approved food spices, and beauty products from An-Nazeer Holistic Home.",
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20 min-h-screen bg-stone-50">
        <div className="bg-[#0f7a3a] py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Our Products
            </h1>
            <p className="text-white/70">
              Natural wellness, NAFDAC-approved quality
            </p>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-72 skeleton" />
                ))}
              </div>
            </div>
          }
        >
          <ShopContent
            initialCategory={searchParams.category}
            initialSearch={searchParams.search}
          />
        </Suspense>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
