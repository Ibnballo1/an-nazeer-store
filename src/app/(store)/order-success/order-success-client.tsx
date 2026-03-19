"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyOrderPayment } from "@/lib/actions/payments";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Package } from "lucide-react";
import { formatNaira } from "@/lib/utils";

type VerifyState =
  | { status: "loading" }
  | { status: "paid"; orderNumber: string; orderId: string }
  | { status: "failed"; orderNumber: string; orderId: string }
  | { status: "abandoned"; orderNumber: string; orderId: string }
  | { status: "error"; message: string };

export function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const orderId = searchParams.get("orderId");

  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    if (!reference) {
      setState({ status: "error", message: "No payment reference found." });
      return;
    }

    verifyOrderPayment(reference).then((result) => {
      if (!result.success) {
        setState({ status: "error", message: result.error });
        return;
      }

      setState({
        status: result.data.status,
        orderNumber: result.data.orderNumber,
        orderId: result.data.orderId,
      });
    });
  }, [reference]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <Loader2 className="h-12 w-12 text-brand-green animate-spin" />
        <p className="text-lg font-medium text-foreground">
          Confirming your payment…
        </p>
        <p className="text-sm text-muted-foreground">
          Please wait, do not refresh this page.
        </p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (state.status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <XCircle className="h-16 w-16 text-destructive" />
        <h1 className="font-display text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-sm">{state.message}</p>
        <Button
          asChild
          className="bg-brand-green hover:bg-brand-green-dark text-white mt-2"
        >
          <Link href="/shop">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  // ── Paid ───────────────────────────────────────────────────────────────────
  if (state.status === "paid") {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-card border border-border max-w-md w-full p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-brand-green-light flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-brand-green" />
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Order Confirmed! 🌿
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We&apos;ve received your payment and will
            begin processing it right away.
          </p>

          {/* Order details */}
          <div className="bg-brand-cream rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-semibold font-mono">
                {state.orderNumber}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="text-brand-green font-semibold">
                Payment received
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            A confirmation will be sent to your email. We&apos;ll notify you
            once your order ships. For questions, contact us via WhatsApp.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="bg-brand-green hover:bg-brand-green-dark text-white"
            >
              <Link href={`/account/orders`}>
                <Package className="mr-2 h-4 w-4" />
                View My Orders
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Failed / Abandoned ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-card border border-border max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Payment {state.status === "abandoned" ? "Cancelled" : "Failed"}
        </h1>

        <p className="text-muted-foreground mb-6">
          {state.status === "abandoned"
            ? "You cancelled the payment. Your order has been saved — you can try again anytime."
            : "Your payment could not be processed. Please try again or contact us for help."}
        </p>

        <div className="bg-brand-cream rounded-xl p-4 mb-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order number</span>
            <span className="font-semibold font-mono">{state.orderNumber}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Retry payment */}
          <Button
            asChild
            className="bg-brand-green hover:bg-brand-green-dark text-white"
          >
            <Link href={`/checkout?orderId=${state.orderId}`}>
              Try Payment Again
            </Link>
          </Button>

          {/* WhatsApp fallback */}
          <Button variant="outline" asChild>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi, I need help with order ${state.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Help via WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
