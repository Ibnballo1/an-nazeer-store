// src/app/order-success/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20 min-h-screen bg-stone-50 flex items-center">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-[#0f7a3a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#0f7a3a]" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-stone-600 text-lg mb-2">
            Thank you for your order. Payment received successfully.
          </p>
          {orderNumber && (
            <div className="inline-flex items-center gap-2 bg-[#0f7a3a]/10 text-[#0f7a3a] font-semibold px-4 py-2 rounded-full mb-8">
              <Package className="w-4 h-4" />
              Order #{orderNumber}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-8 text-left">
            <h2 className="font-semibold text-stone-900 mb-4">
              What happens next?
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Order Processing",
                  description:
                    "Our team is preparing your herbal products with care.",
                },
                {
                  step: "2",
                  title: "Dispatch",
                  description:
                    "Your package will be dispatched within 1-2 business days.",
                },
                {
                  step: "3",
                  title: "Delivery",
                  description:
                    "Expect delivery in 2-5 business days depending on your location.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 bg-[#0f7a3a] text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{item.title}</p>
                    <p className="text-sm text-stone-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-[#0f7a3a] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#0a5c2c] transition-colors"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I just placed order ${orderNumber ?? ""}. Can you confirm my order status?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#22c35e] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Track via WhatsApp
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
