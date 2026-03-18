// src/app/api/payment/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { payments, orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// Verify the request actually came from Paystack
function verifySignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(body)
    .digest("hex");
  return hash === signature;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; data: Record<string, any> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only handle successful charge events
  if (event.event === "charge.success") {
    const {
      reference,
      amount,
      paid_at,
      channel,
      id: transactionId,
    } = event.data;

    try {
      // Update payment record
      await db
        .update(payments)
        .set({
          status: "paid",
          paystackTransactionId: String(transactionId),
          channel,
          paidAt: new Date(paid_at),
          updatedAt: new Date(),
        })
        .where(eq(payments.paystackReference, reference));

      // Get the associated order
      const [payment] = await db
        .select({ orderId: payments.orderId })
        .from(payments)
        .where(eq(payments.paystackReference, reference))
        .limit(1);

      if (payment?.orderId) {
        await db
          .update(orders)
          .set({
            paymentStatus: "paid",
            status: "confirmed",
            updatedAt: new Date(),
          })
          .where(eq(orders.id, payment.orderId));
      }

      revalidatePath("/admin/orders");
      revalidatePath("/admin/dashboard");
    } catch (err) {
      console.error("Webhook processing error:", err);
      // Return 200 anyway so Paystack doesn't retry — log the error instead
    }
  }

  return NextResponse.json({ received: true });
}
