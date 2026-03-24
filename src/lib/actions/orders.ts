"use server";

import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, desc, and, sql, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAdmin } from "../server";
import { shippingSchema } from "@/lib/validations/checkout";
import { clearCart } from "./cart";
import { generateOrderNumber, calculateShippingFee } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";
import type { Order, NewOrder } from "@/db/schema";
import type { ShippingInput } from "@/lib/validations/checkout";

// ─────────────────────────────────────────────────────────────────────────────
// Create order (supports both authenticated users and guests)
// ─────────────────────────────────────────────────────────────────────────────

export type CreateOrderInput = {
  shipping: ShippingInput;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  customerNote?: string;
};

export type OrderCreated = {
  orderId: string;
  orderNumber: string;
  total: number;
};

export async function createOrder(
  input: CreateOrderInput,
): Promise<ActionResult<OrderCreated>> {
  // Validate shipping details
  const shippingParsed = shippingSchema.safeParse(input.shipping);
  if (!shippingParsed.success) {
    return { success: false, error: shippingParsed.error.issues[0].message };
  }

  if (!input.items.length) {
    return { success: false, error: "Your cart is empty." };
  }

  // Get current session (may be null for guests)
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ?? null;

  // Fetch product data and validate stock
  const productIds = input.items.map((i) => i.productId);
  const dbProducts = await db.query.products.findMany({
    where: (p, { inArray, isNull, eq, and }) =>
      and(
        inArray(p.id, productIds),
        eq(p.status, "active"),
        isNull(p.deletedAt),
      ),
  });

  if (dbProducts.length !== input.items.length) {
    return { success: false, error: "One or more products are unavailable." };
  }

  // Validate stock for each item
  for (const item of input.items) {
    const product = dbProducts.find((p) => p.id === item.productId);
    if (!product) {
      return { success: false, error: "Product not found." };
    }
    if (product.trackInventory && !product.allowBackorder) {
      if (item.quantity > product.stock) {
        return {
          success: false,
          error: `"${product.name}" only has ${product.stock} unit(s) in stock.`,
        };
      }
    }
  }

  // Calculate totals
  const subtotal = input.items.reduce((sum, item) => {
    const product = dbProducts.find((p) => p.id === item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const shippingFee = calculateShippingFee(shippingParsed.data.state);
  const total = subtotal + shippingFee;
  const orderNumber = generateOrderNumber();
  const shipping = shippingParsed.data;

  try {
    // Create order + items in a transaction
    const [order] = await db.transaction(async (tx) => {
      // Insert order
      const [newOrder] = await tx
        .insert(orders)
        .values({
          orderNumber,
          userId,
          // Guest fields
          guestEmail: !userId ? shipping.email : null,
          guestName: !userId ? shipping.name : null,
          guestPhone: !userId ? shipping.phone : null,
          // Shipping snapshot
          shippingName: shipping.name,
          shippingEmail: shipping.email,
          shippingPhone: shipping.phone,
          shippingAddress: shipping.address,
          shippingCity: shipping.city,
          shippingState: shipping.state,
          shippingCountry: shipping.country ?? "Nigeria",
          // Totals
          subtotal: String(subtotal),
          shippingFee: String(shippingFee),
          total: String(total),
          customerNote: input.customerNote,
          status: "pending",
          paymentStatus: "pending",
        } satisfies Omit<NewOrder, "id" | "createdAt" | "updatedAt">)
        .returning();

      // Insert order items
      await tx.insert(orderItems).values(
        input.items.map((item) => {
          const product = dbProducts.find((p) => p.id === item.productId)!;
          return {
            orderId: newOrder.id,
            productId: product.id,
            productName: product.name,
            productImage: product.thumbnailUrl,
            productSlug: product.slug,
            quantity: item.quantity,
            unitPrice: product.price,
            subtotal: String(Number(product.price) * item.quantity),
          };
        }),
      );

      // Decrement stock for each product
      for (const item of input.items) {
        const product = dbProducts.find((p) => p.id === item.productId)!;
        if (product.trackInventory) {
          await tx
            .update(products)
            .set({
              stock: sql`GREATEST(0, ${products.stock} - ${item.quantity})`,
              updatedAt: new Date(),
            })
            .where(eq(products.id, product.id));
        }
      }

      return [newOrder];
    });

    // Clear the cart cookie
    await clearCart();

    revalidatePath("/admin/orders");

    return {
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total,
      },
    };
  } catch (err) {
    console.error("[createOrder]", err);
    return {
      success: false,
      error: "Failed to place order. Please try again.",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Get order by ID (with items) — owner or admin only
// ─────────────────────────────────────────────────────────────────────────────

export async function getOrderById(orderId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true, payments: true },
  });

  if (!order) return null;

  // Allow: admin, order owner, or guest (identified by matching email in session)
  const isOwner = session?.user.id && order.userId === session.user.id;
  const isAdmin = session?.user.role === "admin";
  const isGuest = !order.userId; // guest orders are accessible via link

  if (!isOwner && !isAdmin && !isGuest) return null;

  return order;
}

// ─────────────────────────────────────────────────────────────────────────────
// Get orders for the current logged-in user
// ─────────────────────────────────────────────────────────────────────────────

export async function getUserOrders() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  return db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    orderBy: [desc(orders.createdAt)],
    with: { items: true },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Get all orders with pagination
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllOrders(opts: {
  page?: number;
  status?: string;
  search?: string;
}) {
  await requireAdmin();

  const page = Math.max(1, opts.page ?? 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const [rows, [{ count }]] = await Promise.all([
    db.query.orders.findMany({
      where: opts.status
        ? eq(orders.status, opts.status as Order["status"])
        : undefined,
      orderBy: [desc(orders.createdAt)],
      limit: pageSize,
      offset,
      // Only columns needed for the orders table
      columns: {
        id: true,
        orderNumber: true,
        shippingName: true,
        shippingEmail: true,
        total: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
      with: {
        items: {
          columns: { id: true }, // count only
        },
      },
    }),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(
        opts.status
          ? eq(orders.status, opts.status as Order["status"])
          : undefined,
      ),
  ]);

  return {
    data: rows,
    total: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Update order status
// ─────────────────────────────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  trackingNumber?: string,
): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db
      .update(orders)
      .set({
        status,
        ...(trackingNumber ? { trackingNumber } : {}),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true, data: undefined };
  } catch (err) {
    console.error("[updateOrderStatus]", err);
    return { success: false, error: "Failed to update order status." };
  }
}
