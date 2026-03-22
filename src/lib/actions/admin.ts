"use server";

import { db } from "@/db";
import { orders, products, user, consultationRequests } from "@/db/schema";
import { eq, sql, gte, and, isNull, desc } from "drizzle-orm";
import { requireAdmin } from "../server";

export async function getDashboardStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalRevenue,
    recentRevenue,
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    totalCustomers,
    pendingConsultations,
  ] = await Promise.all([
    // All-time revenue (paid orders)
    db
      .select({ sum: sql<number>`COALESCE(SUM(total::numeric), 0)` })
      .from(orders)
      .where(eq(orders.paymentStatus, "paid")),

    // Last 30 days revenue
    db
      .select({ sum: sql<number>`COALESCE(SUM(total::numeric), 0)` })
      .from(orders)
      .where(
        and(
          eq(orders.paymentStatus, "paid"),
          gte(orders.createdAt, thirtyDaysAgo),
        ),
      ),

    // Total orders count
    db.select({ count: sql<number>`count(*)::int` }).from(orders),

    // Pending orders
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(eq(orders.status, "pending")),

    // Active products
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(and(eq(products.status, "active"), isNull(products.deletedAt))),

    // Low stock products (stock <= threshold)
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(
        and(
          eq(products.status, "active"),
          isNull(products.deletedAt),
          sql`${products.stock} <= ${products.lowStockThreshold}`,
        ),
      ),

    // Registered customers
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
      .where(and(eq(user.role, "customer"), isNull(user.deletedAt))),

    // Pending consultation requests
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(consultationRequests)
      .where(eq(consultationRequests.status, "pending")),
  ]);

  return {
    totalRevenue: totalRevenue[0].sum,
    recentRevenue: recentRevenue[0].sum,
    totalOrders: totalOrders[0].count,
    pendingOrders: pendingOrders[0].count,
    totalProducts: totalProducts[0].count,
    lowStockProducts: lowStockProducts[0].count,
    totalCustomers: totalCustomers[0].count,
    pendingConsultations: pendingConsultations[0].count,
  };
}

export async function getRecentOrders(limit = 8) {
  await requireAdmin();

  return db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit,
    with: { items: true },
  });
}
