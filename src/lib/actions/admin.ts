"use server";

import { db } from "@/db";
import { orders, products, user, consultationRequests } from "@/db/schema";
import { eq, sql, gte, and, isNull, desc } from "drizzle-orm";
import { requireAdmin } from "../server";

export async function getDashboardStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [stats] = await db.select({
    totalRevenue: sql<number>`(SELECT COALESCE(SUM(total::numeric), 0) FROM ${orders} WHERE payment_status = 'paid')`,
    recentRevenue: sql<number>`(SELECT COALESCE(SUM(total::numeric), 0) FROM ${orders} WHERE payment_status = 'paid' AND created_at >= ${thirtyDaysAgo})`,
    totalOrders: sql<number>`(SELECT count(*)::int FROM ${orders})`,
    pendingOrders: sql<number>`(SELECT count(*)::int FROM ${orders} WHERE status = 'pending')`,
    totalProducts: sql<number>`(SELECT count(*)::int FROM ${products} WHERE status = 'active' AND deleted_at IS NULL)`,
    lowStockProducts: sql<number>`(SELECT count(*)::int FROM ${products} WHERE status = 'active' AND deleted_at IS NULL AND stock <= low_stock_threshold)`,
    totalCustomers: sql<number>`(SELECT count(*)::int FROM ${user} WHERE role = 'customer' AND deleted_at IS NULL)`,
    pendingConsultations: sql<number>`(SELECT count(*)::int FROM ${consultationRequests} WHERE status = 'pending')`,
  });

  return stats;
}

export async function getRecentOrders(limit = 8) {
  await requireAdmin();

  return db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit,
    with: { items: true },
  });
}
