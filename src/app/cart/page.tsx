// src/app/cart/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sprout,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();
  const shippingCost = total >= 20000 ? 0 : 1500;
  const grandTotal = total + shippingCost;

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20 min-h-screen bg-stone-50">
        <div className="bg-[#0f7a3a] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl font-bold text-white">
              Your Cart
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-stone-500 mb-8">
                Discover our natural wellness products
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#0f7a3a] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#0a5c2c] transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm flex gap-4"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-stone-50 rounded-xl overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Sprout className="w-8 h-8 text-stone-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-900 text-sm md:text-base mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-[#0f7a3a] font-bold text-sm md:text-base mb-3">
                        ₦{item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center gap-2 bg-stone-100 rounded-full px-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Line total + remove */}
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-stone-900 text-sm">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-24">
                  <h2 className="font-display text-xl font-bold text-stone-900 mb-6">
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-stone-600">
                      <span>Subtotal</span>
                      <span>₦{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-stone-600">
                      <span>Shipping</span>
                      <span
                        className={
                          shippingCost === 0 ? "text-[#0f7a3a] font-medium" : ""
                        }
                      >
                        {shippingCost === 0
                          ? "Free"
                          : `₦${shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-stone-400">
                        Free shipping on orders above ₦20,000
                      </p>
                    )}
                    <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-stone-900">
                      <span>Total</span>
                      <span className="text-[#0f7a3a]">
                        ₦{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full bg-[#0f7a3a] text-white font-semibold py-4 rounded-xl text-center hover:bg-[#0a5c2c] transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/shop"
                    className="block w-full text-[#0f7a3a] font-medium py-3 rounded-xl text-center mt-3 hover:bg-stone-50 transition-colors text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
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
