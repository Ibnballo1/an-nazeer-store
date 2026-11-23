"use client";

import { useState, useTransition } from "react";
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
import { formatNaira } from "@/lib/utils";
import { Loader2, ShieldCheck, MessageCircle } from "lucide-react";
import type { Cart } from "@/types";
import { PickupLocationSelector } from "@/components/layout/pickup-location-selector";
import { setPickupLocation } from "@/lib/actions/pickup-location";
import {
  PICKUP_LOCATION_DETAILS,
  type PickupLocation,
} from "@/lib/pickup-locations";

// Check if WhatsApp mode is enabled (defaulting to 'whatsapp' or 'paystack')
const CHECKOUT_MODE = process.env.NEXT_PUBLIC_CHECKOUT_MODE || "whatsapp";

export function CheckoutForm({ cart }: { cart: Cart }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [pickupLocation, setSelectedPickupLocation] =
    useState<PickupLocation>(cart.pickupLocation);
  const [, startLocationUpdate] = useTransition();

  const form = useForm<ShippingInput, undefined, ShippingInput>({
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

  const total = cart.subtotal;

  function changePickupLocation(location: PickupLocation) {
    setSelectedPickupLocation(location);
    startLocationUpdate(async () => {
      await setPickupLocation(location);
      router.refresh();
    });
  }

  async function onSubmit(shipping: ShippingInput) {
    setLoading(true);

    try {
      // 1. Create order
      const orderResult = await createOrder({
        shipping,
        pickupLocation,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        customerNote: note || undefined,
      });

      if (!orderResult.success) {
        toast.error(orderResult.error || "Failed to create order 🌿");
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
              Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  placeholder="Amina Ibrahim"
                  className="placeholder:text-gray-400"
                  {...form.register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="placeholder:text-gray-400"
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
                  className="placeholder:text-gray-400"
                  {...form.register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="address">Delivery address (optional)</Label>
                <Input
                  id="address"
                  placeholder="12 Botanical Gardens Street"
                  className="placeholder:text-gray-400"
                  {...form.register("address")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">City (optional)</Label>
                <Input
                  id="city"
                  placeholder="Lagos"
                  className="placeholder:text-gray-400"
                  {...form.register("city")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state">State (optional)</Label>
                <Input
                  id="state"
                  placeholder="e.g. Lagos"
                  className="placeholder:text-gray-400"
                  {...form.register("state")}
                />
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
              onChange={(event) => setNote(event.target.value)}
              className="rounded-xl resize-none placeholder:text-gray-400"
              rows={3}
            />
          </div>
        </div>

        {/* ── Order Summary ─────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-base mb-5">Order Summary</h2>

            <div className="mb-5 rounded-xl bg-brand-cream/70 p-3 space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Pickup location
              </p>
              <PickupLocationSelector
                initialLocation={pickupLocation}
                onLocationChange={changePickupLocation}
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {PICKUP_LOCATION_DETAILS[pickupLocation].address}
              </p>
            </div>

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

            <div className="border-t border-border pt-4">
              <div className="flex justify-between font-bold">
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
