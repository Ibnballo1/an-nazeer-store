"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { initOrderPayment } from "@/lib/actions/payments";
import { Loader2, CreditCard } from "lucide-react";

type Props = {
  orderId: string;
  total: number;
  disabled?: boolean;
};

export function PaystackButton({ orderId, total, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePay() {
    setLoading(true);

    try {
      const result = await initOrderPayment(orderId);

      if (!result.success) {
        toast.error(`Payment failed, ${result.error}`);

        return;
      }

      // Redirect to Paystack hosted checkout
      window.location.href = result.data.authorizationUrl;
    } catch (err) {
      toast(
        `Something went wrong, unable to initialize payment. Please try again`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handlePay}
      disabled={disabled || loading}
      size="lg"
      className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold text-base h-14 rounded-xl shadow-soft"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Redirecting to Paystack…
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Pay ₦{Number(total).toLocaleString("en-NG")}
        </>
      )}
    </Button>
  );
}
