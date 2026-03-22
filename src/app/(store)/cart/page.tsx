import { Metadata } from "next";
import Link from "next/link";
import { getCart } from "@/lib/actions/cart";
import { CartItems } from "./cart-items";
import { Button } from "@/components/ui/button";
import { formatNaira, calculateShippingFee } from "@/lib/utils";
import { ShoppingBag, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Your Cart" };

export default async function CartPage() {
  const cart = await getCart();

  if (cart.itemCount === 0) {
    return (
      <div className="container-safe py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display text-2xl font-semibold mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-6">
          Discover our natural wellness products
        </p>
        <Button
          asChild
          className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
        >
          <Link href="/shop">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  const estimatedShipping = calculateShippingFee("Lagos");
  const total = cart.subtotal + estimatedShipping;

  return (
    <div className="container-safe py-8 md:py-10">
      <h1 className="font-display text-2xl md:text-3xl font-semibold mb-8">
        Your Cart ({cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <CartItems initialCart={cart} />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatNaira(cart.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping (est.)</span>
                <span className="font-medium">
                  {estimatedShipping === 0 ? (
                    <span className="text-brand-green">Free</span>
                  ) : (
                    formatNaira(estimatedShipping)
                  )}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-brand-green">{formatNaira(total)}</span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full mt-6 bg-brand-green hover:bg-brand-green-dark text-white rounded-xl h-12"
            >
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Secure payment via Paystack 🔒
            </p>

            <Button asChild variant="ghost" className="w-full mt-2" size="sm">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
