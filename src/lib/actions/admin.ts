"use server";

import { db } from "@/db";
import { orders, products, consultationRequests } from "@/db/schema";
import { eq, sql, gte, and, isNull, desc, lte } from "drizzle-orm";
import { requireAdmin } from "@/lib/server";

export type DashboardStats = {
  totalRevenue: number;
  recentRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  pendingConsultations: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard stats
// Uses parallel queries — reliable, works with any table naming convention
// ─────────────────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Run all queries in parallel — one round trip per query but all concurrent
  const [
    totalRevenueResult,
    recentRevenueResult,
    totalOrdersResult,
    pendingOrdersResult,
    totalProductsResult,
    lowStockResult,
    totalCustomersResult,
    pendingConsultationsResult,
  ] = await Promise.all([
    // 1. Total revenue (all time)
    db
      .select({ value: sql<string>`COALESCE(SUM(total::numeric), 0)` })
      .from(orders)
      .where(eq(orders.paymentStatus, "paid")),

    // 2. Recent revenue (last 30 days)
    db
      .select({ value: sql<string>`COALESCE(SUM(total::numeric), 0)` })
      .from(orders)
      .where(
        and(
          eq(orders.paymentStatus, "paid"),
          gte(orders.createdAt, thirtyDaysAgo),
        ),
      ),

    // 3. Total orders
    db.select({ value: sql<number>`count(*)::int` }).from(orders),

    // 4. Pending orders
    db
      .select({ value: sql<number>`count(*)::int` })
      .from(orders)
      .where(eq(orders.status, "pending")),

    // 5. Active products
    db
      .select({ value: sql<number>`count(*)::int` })
      .from(products)
      .where(and(eq(products.status, "active"), isNull(products.deletedAt))),

    // 6. Low stock products
    db
      .select({ value: sql<number>`count(*)::int` })
      .from(products)
      .where(
        and(
          eq(products.status, "active"),
          isNull(products.deletedAt),
          sql`${products.stock} <= ${products.lowStockThreshold}`,
        ),
      ),

    // 7. Total customers — query the user table via raw SQL
    // avoids any naming/column issues with BetterAuth's user table
    db.execute(
      sql`SELECT COUNT(*)::int AS value FROM "user" WHERE deleted_at IS NULL`,
    ),

    // 8. Pending consultations
    db
      .select({ value: sql<number>`count(*)::int` })
      .from(consultationRequests)
      .where(eq(consultationRequests.status, "pending")),
  ]);

  // Extract customer count from raw SQL result
  const customerRows = totalCustomersResult as unknown as Array<{
    value: number;
  }>;
  const totalCustomers = Number(customerRows[0]?.value ?? 0);

  return {
    totalRevenue: Number(totalRevenueResult[0]?.value ?? 0),
    recentRevenue: Number(recentRevenueResult[0]?.value ?? 0),
    totalOrders: Number(totalOrdersResult[0]?.value ?? 0),
    pendingOrders: Number(pendingOrdersResult[0]?.value ?? 0),
    totalProducts: Number(totalProductsResult[0]?.value ?? 0),
    lowStockProducts: Number(lowStockResult[0]?.value ?? 0),
    totalCustomers,
    pendingConsultations: Number(pendingConsultationsResult[0]?.value ?? 0),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent orders for dashboard table
// ─────────────────────────────────────────────────────────────────────────────

export async function getRecentOrders(limit = 8) {
  await requireAdmin();

  return db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit,
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
        columns: { id: true },
      },
    },
  });
}
