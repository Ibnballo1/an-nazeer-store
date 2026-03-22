import { Suspense } from "react";
import { Metadata } from "next";
import { OrderSuccessClient } from "./order-success-client";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-brand-green border-t-transparent animate-spin" />
        </div>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}
