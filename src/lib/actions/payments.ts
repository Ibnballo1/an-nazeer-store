"use server";

import { db } from "@/db";
import { orders, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { initializePayment, verifyPayment } from "@/lib/paystack";
import { formatNaira, generatePaystackRef, toKobo } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Initialize payment for an order
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentInitResult = {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
};

export async function initOrderPayment(
  orderId: string,
): Promise<ActionResult<PaymentInitResult>> {
  // Fetch order
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  // Prevent double payment
  if (order.paymentStatus === "paid") {
    return { success: false, error: "This order has already been paid." };
  }

  // Verify ownership (auth user OR guest accessing their own order)
  const session = await auth.api.getSession({ headers: await headers() });
  const isOwner = session?.user.id === order.userId;
  const isGuest = !order.userId;

  if (!isOwner && !isGuest && session?.user.role !== "admin") {
    return { success: false, error: "Unauthorised." };
  }

  const reference = generatePaystackRef();
  const amountKobo = toKobo(Number(order.total));
  const email = order.shippingEmail;
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order-success?reference=${reference}&orderId=${orderId}`;

  try {
    const paystack = await initializePayment({
      email,
      amountKobo,
      reference,
      callbackUrl,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.shippingName,
      },
    });

    // Persist pending payment record
    await db.insert(payments).values({
      orderId,
      paystackReference: reference,
      paystackAccessCode: paystack.access_code,
      amount: String(order.total),
      amountInKobo: amountKobo,
      currency: "NGN",
      method: "paystack",
      status: "pending",
    });

    return {
      success: true,
      data: {
        authorizationUrl: paystack.authorization_url,
        reference,
        accessCode: paystack.access_code,
      },
    };
  } catch (err) {
    console.error("[initOrderPayment]", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Payment initialization failed.",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Verify payment after Paystack callback
// ─────────────────────────────────────────────────────────────────────────────

export type VerifyResult = {
  orderId: string;
  orderNumber: string;
  status: "paid" | "failed" | "abandoned";
};

export async function verifyOrderPayment(
  reference: string,
): Promise<ActionResult<VerifyResult>> {
  if (!reference) {
    return { success: false, error: "Missing payment reference." };
  }

  // Look up payment record
  const payment = await db.query.payments.findFirst({
    where: eq(payments.paystackReference, reference),
    with: { order: true },
  });

  if (!payment) {
    return { success: false, error: "Payment record not found." };
  }

  // If already verified, return immediately (idempotent)
  if (payment.status === "paid") {
    return {
      success: true,
      data: {
        orderId: payment.order.id,
        orderNumber: payment.order.orderNumber,
        status: "paid",
      },
    };
  }

  try {
    const paystackData = await verifyPayment(reference);

    const isPaid = paystackData.status === "success";
    const isFailed = paystackData.status === "failed";
    const isAbandoned = paystackData.status === "abandoned";

    const paymentStatus = isPaid ? "paid" : isFailed ? "failed" : "pending";

    const orderPaymentStatus = isPaid
      ? "paid"
      : isFailed
        ? "failed"
        : "pending";

    const orderStatus = isPaid ? "confirmed" : payment.order.status;

    // Update payment record
    await db
      .update(payments)
      .set({
        status: paymentStatus,
        paystackAuthorizationCode:
          paystackData.authorization?.authorization_code ?? null,
        gatewayResponse: paystackData as unknown as Record<string, unknown>,
        paidAt: isPaid ? new Date(paystackData.paid_at) : null,
        updatedAt: new Date(),
      })
      .where(eq(payments.paystackReference, reference));

    // Update order status
    await db
      .update(orders)
      .set({
        paymentStatus: orderPaymentStatus,
        status: orderStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, payment.orderId));

    revalidatePath("/admin/orders");
    revalidatePath(`/account/orders`);

    return {
      success: true,
      data: {
        orderId: payment.order.id,
        orderNumber: payment.order.orderNumber,
        status: isPaid ? "paid" : isAbandoned ? "abandoned" : "failed",
      },
    };
  } catch (err) {
    console.error("[verifyOrderPayment]", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Payment verification failed.",
    };
  }
}

// Add MessageSquare to your lucide-react imports if needed, but for server actions we just return strings/data

export type WhatsAppCheckoutResult = {
  whatsAppUrl: string;
};

export async function initWhatsAppCheckout(
  orderId: string,
): Promise<ActionResult<WhatsAppCheckoutResult>> {
  try {
    // Fetch order with items
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348000000000";
    // Format phone to clean international format (remove +, leading zeros if needed)
    const phone = rawPhone.replace(/\D/g, "");

    // Build itemized breakdown for WhatsApp
    const itemSummary = order.items
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product?.name ?? "Unknown product"} (${formatNaira(Number(item.unitPrice))})`,
      )
      .join("\n");

    const message = `Hello! 👋 I would like to place an order:

*Order ID:* #${order.orderNumber}
*Customer:* ${order.shippingName}
*Phone:* ${order.shippingPhone}
*Delivery Address:* ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState}

*Order Items:*
${itemSummary}

*Subtotal:* ${formatNaira(Number(order.subtotal))}
*Shipping:* ${formatNaira(Number(order.shippingFee))}
*Total Amount:* ${formatNaira(Number(order.total))}
${order.customerNote ? `\n*Note:* ${order.customerNote}` : ""}

Please confirm my order and let me know how to pay.`;

    const whatsAppUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return {
      success: true,
      data: { whatsAppUrl },
    };
  } catch (err) {
    console.error("[initWhatsAppCheckout]", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to initialize WhatsApp checkout.",
    };
  }
}
