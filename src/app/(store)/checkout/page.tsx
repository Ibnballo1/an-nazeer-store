import { Metadata } from "next";
import { getCart } from "@/lib/actions/cart";
import { redirect } from "next/navigation";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.itemCount === 0) redirect("/cart");

  return (
    <div className="container-safe py-8 md:py-10 max-w-4xl">
      <h1 className="font-display text-2xl md:text-3xl font-semibold mb-8">
        Checkout
      </h1>
      <CheckoutForm cart={cart} />
    </div>
  );
}
