"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrder } from "@/lib/actions/orders";
import { initOrderPayment, initWhatsAppCheckout } from "@/lib/actions/payments";
import { shippingSchema, type ShippingInput } from "@/lib/validations/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatNaira, calculateShippingFee } from "@/lib/utils";
import { Loader2, ShieldCheck, MessageCircle } from "lucide-react";
import type { Cart } from "@/types";

// Check if WhatsApp mode is enabled (defaulting to 'whatsapp' or 'paystack')
const CHECKOUT_MODE = process.env.NEXT_PUBLIC_CHECKOUT_MODE || "whatsapp";

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

export function CheckoutForm({ cart }: { cart: Cart }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<ShippingInput>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
  });

  const watchedState = form.watch("state");
  const shippingFee = calculateShippingFee(watchedState);
  const total = cart.subtotal + shippingFee;

  async function onSubmit(shipping: ShippingInput) {
    setLoading(true);

    try {
      // 1. Create order
      const orderResult = await createOrder({
        shipping,
        items: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        customerNote: note || undefined,
      });

      if (!orderResult.success) {
        toast.error("Failed to create order 🌿");
        return;
      }

      // 2. Handle WhatsApp Checkout Flow
      if (CHECKOUT_MODE === "whatsapp") {
        const waResult = await initWhatsAppCheckout(orderResult.data.orderId);

        if (!waResult.success) {
          toast.error("Failed to generate WhatsApp order details 🌿");
          return;
        }

        // Redirect directly to WhatsApp chat
        window.location.href = waResult.data.whatsAppUrl;
        return;
      }

      // 3. Initialize payment
      const payResult = await initOrderPayment(orderResult.data.orderId);

      if (!payResult.success) {
        toast.error("Failed to initialize payment 🌿");
        return;
      }

      // 4. Redirect to Paystack
      window.location.href = payResult.data.authorizationUrl;
    } finally {
      setLoading(false);
    }
  }

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Shipping Form ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-base mb-5">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  placeholder="Amina Ibrahim"
                  {...form.register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...form.register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08012345678"
                  {...form.register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="address">Delivery address *</Label>
                <Input
                  id="address"
                  placeholder="12 Botanical Gardens Street"
                  {...form.register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Lagos"
                  {...form.register("city")}
                />
                {errors.city && (
                  <p className="text-xs text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...form.register("state")}
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-destructive">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Note */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-base mb-4">
              Order Note (Optional)
            </h2>
            <Textarea
              placeholder="Any special instructions for your order…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* ── Order Summary ─────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-base mb-5">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm gap-2"
                >
                  <span className="text-muted-foreground line-clamp-1">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {formatNaira(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatNaira(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-brand-green font-medium">Free</span>
                  ) : (
                    formatNaira(shippingFee)
                  )}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-brand-green">{formatNaira(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className={`w-full mt-6 text-white rounded-xl h-12 ${
                CHECKOUT_MODE === "whatsapp"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-brand-green hover:bg-brand-green-dark"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : CHECKOUT_MODE === "whatsapp" ? (
                <>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Complete Order on WhatsApp
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Pay {formatNaira(total)}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-3">
              {CHECKOUT_MODE === "whatsapp"
                ? "💬 You will be redirected to WhatsApp to confirm your order and make payment."
                : "🔒 Secured by Paystack. You will be redirected to complete payment."}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
