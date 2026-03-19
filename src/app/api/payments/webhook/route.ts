import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { orders, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: NextRequest) {
  // ── 1. Verify webhook signature ─────────────────────────────────────────
  const rawBody = await req.text();
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(rawBody)
    .digest("hex");

  const signature = req.headers.get("x-paystack-signature") ?? "";

  if (hash !== signature) {
    console.warn("[webhook] Invalid Paystack signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // ── 2. Parse event ───────────────────────────────────────────────────────
  let event: { event: string; data: Record<string, unknown> };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ── 3. Handle charge.success ─────────────────────────────────────────────
  if (event.event === "charge.success") {
    const data = event.data;
    const reference = data.reference as string;
    const amountKobo = data.amount as number;
    const paidAt = data.paid_at as string;
    const customer = data.customer as { email: string };

    try {
      const payment = await db.query.payments.findFirst({
        where: eq(payments.paystackReference, reference),
      });

      if (!payment) {
        console.warn(`[webhook] No payment found for reference: ${reference}`);
        return NextResponse.json({ received: true });
      }

      // Idempotency guard
      if (payment.status === "paid") {
        return NextResponse.json({ received: true });
      }

      // Mark payment as paid
      await db
        .update(payments)
        .set({
          status: "paid",
          gatewayResponse: data,
          paidAt: new Date(paidAt),
          updatedAt: new Date(),
        })
        .where(eq(payments.paystackReference, reference));

      // Mark order as confirmed + paid
      await db
        .update(orders)
        .set({
          paymentStatus: "paid",
          status: "confirmed",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, payment.orderId));

      console.log(`[webhook] Order confirmed: ${payment.orderId}`);
    } catch (err) {
      console.error("[webhook] charge.success handler failed:", err);
      // Return 200 so Paystack doesn't retry unnecessarily
      return NextResponse.json({ received: true });
    }
  }

  // ── 4. Handle charge.failed ──────────────────────────────────────────────
  if (event.event === "charge.failed") {
    const reference = (event.data.reference ?? "") as string;

    if (reference) {
      await db
        .update(payments)
        .set({ status: "failed", updatedAt: new Date() })
        .where(eq(payments.paystackReference, reference));

      await db
        .update(orders)
        .set({ paymentStatus: "failed", updatedAt: new Date() })
        .where(
          eq(
            orders.id,
            (
              await db.query.payments.findFirst({
                where: eq(payments.paystackReference, reference),
              })
            )?.orderId ?? "",
          ),
        );
    }
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing — we need raw text for HMAC verification
export const dynamic = "force-dynamic";
