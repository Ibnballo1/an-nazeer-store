// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { createOrder } from "@/lib/actions/orders";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useSession } from "@/lib/authClient";
import { toast } from "sonner";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(10, "Please enter your full address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please select your state"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const total = getTotal();
  const shippingCost = total >= 20000 ? 0 : 1500;
  const grandTotal = total + shippingCost;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  async function onSubmit(data: CheckoutForm) {
    setIsLoading(true);
    try {
      const result = await createOrder({
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          productImage: item.image,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        shippingName: data.fullName,
        shippingEmail: data.email,
        shippingPhone: data.phone,
        shippingAddress: data.address,
        shippingCity: data.city,
        shippingState: data.state,
        notes: data.notes,
        ...(!session && {
          guestName: data.fullName,
          guestEmail: data.email,
          guestPhone: data.phone,
        }),
      });

      // Redirect to Paystack
      window.location.href = result.authorizationUrl;
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-20 min-h-screen bg-stone-50">
        <div className="bg-[#0f7a3a] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl font-bold text-white">
              Checkout
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Guest notice */}
                {!session && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                    <strong>Guest Checkout</strong> — You can checkout without
                    an account.
                    <a
                      href="/login?redirect=/checkout"
                      className="underline ml-1"
                    >
                      Sign in
                    </a>{" "}
                    to track your orders.
                  </div>
                )}

                {/* Customer info */}
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                  <h2 className="font-semibold text-stone-900 mb-4">
                    Customer Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        {...register("fullName")}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="0800 000 0000"
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                  <h2 className="font-semibold text-stone-900 mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Street Address *
                      </label>
                      <input
                        {...register("address")}
                        placeholder="House number, street name, area"
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">
                          City *
                        </label>
                        <input
                          {...register("city")}
                          placeholder="City"
                          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a]"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">
                          State *
                        </label>
                        <select
                          {...register("state")}
                          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] bg-white"
                        >
                          <option value="">Select state</option>
                          {NIGERIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Order Notes (optional)
                      </label>
                      <textarea
                        {...register("notes")}
                        rows={3}
                        placeholder="Any special instructions for delivery..."
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 focus:border-[#0f7a3a] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Security notice */}
                <div className="flex items-center gap-3 text-sm text-stone-500 bg-white rounded-xl p-4 border border-stone-100">
                  <ShieldCheck className="w-5 h-5 text-[#0f7a3a] shrink-0" />
                  <span>
                    Your payment is secured by Paystack. We never store your
                    card details.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-[#0f7a3a] text-white font-bold py-4 rounded-xl hover:bg-[#0a5c2c] transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ₦{grandTotal.toLocaleString()} Securely
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sticky top-24">
                <h2 className="font-display text-lg font-bold text-stone-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-12 bg-stone-100 rounded-lg shrink-0 overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-stone-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-stone-900 shrink-0">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Subtotal</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Shipping</span>
                    <span
                      className={shippingCost === 0 ? "text-[#0f7a3a]" : ""}
                    >
                      {shippingCost === 0
                        ? "Free"
                        : `₦${shippingCost.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100">
                    <span>Total</span>
                    <span className="text-[#0f7a3a] text-lg">
                      ₦{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
