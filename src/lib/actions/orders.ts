// src/lib/actions/orders.ts
"use server";

import { db } from "@/db";
import { orders, orderItems, payments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  generateOrderNumber,
  generatePaystackReference,
  initializePayment,
  verifyPayment,
} from "@/lib/payments/paystack";
import { revalidatePath } from "next/cache";

interface CreateOrderInput {
  items: Array<{
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  notes?: string;
  // guest fields
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}

export async function createOrder(input: CreateOrderInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  const subtotal = input.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0,
  );
  const shippingCost = subtotal >= 20000 ? 0 : 1500; // free shipping above ₦20k
  const total = subtotal + shippingCost;

  const orderNumber = generateOrderNumber();
  const paystackRef = generatePaystackReference();

  // Create order
  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      shippingName: input.shippingName,
      shippingEmail: input.shippingEmail,
      shippingPhone: input.shippingPhone,
      shippingAddress: input.shippingAddress,
      shippingCity: input.shippingCity,
      shippingState: input.shippingState,
      subtotal: subtotal.toString(),
      shippingCost: shippingCost.toString(),
      total: total.toString(),
      notes: input.notes,
    })
    .returning();

  // Create order items
  await db.insert(orderItems).values(
    input.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      totalPrice: (item.unitPrice * item.quantity).toString(),
    })),
  );

  // Create pending payment record
  await db.insert(payments).values({
    orderId: order.id,
    paystackReference: paystackRef,
    amount: total.toString(),
    currency: "NGN",
    status: "pending",
  });

  // Initialize Paystack
  const paystackInit = await initializePayment({
    email: input.shippingEmail,
    amount: total,
    reference: paystackRef,
    metadata: {
      orderId: order.id,
      orderNumber,
      customerName: input.shippingName,
    },
  });

  return {
    orderId: order.id,
    orderNumber,
    authorizationUrl: paystackInit.data.authorization_url,
  };
}

export async function verifyOrderPayment(reference: string) {
  const verification = await verifyPayment(reference);

  if (!verification.status || verification.data.status !== "success") {
    return { success: false, message: "Payment verification failed" };
  }

  // Update payment record
  await db
    .update(payments)
    .set({
      status: "paid",
      paystackTransactionId: verification.data.id.toString(),
      channel: verification.data.channel,
      paidAt: new Date(verification.data.paid_at),
      updatedAt: new Date(),
    })
    .where(eq(payments.paystackReference, reference));

  // Get order from payment
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.paystackReference, reference));

  if (payment) {
    await db
      .update(orders)
      .set({
        paymentStatus: "paid",
        status: "confirmed",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, payment.orderId));

    revalidatePath("/admin/orders");

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, payment.orderId));

    return { success: true, order };
  }

  return { success: false, message: "Order not found" };
}

export async function getUserOrders(userId: string) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

export async function adminGetAllOrders() {
  const session = await auth.api.getSession({ headers: await headers() });
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled",
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  revalidatePath("/admin/orders");
}
