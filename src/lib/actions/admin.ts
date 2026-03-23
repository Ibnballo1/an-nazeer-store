"use server";

import { db } from "@/db";
import { orders, products, user, consultationRequests } from "@/db/schema";
import { eq, sql, gte, and, isNull, desc } from "drizzle-orm";
import { requireAdmin } from "../server";

export async function getDashboardStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // We use db.execute to run a raw SQL block that returns exactly what we need
  const result = await db.execute(sql`
    SELECT 
      (SELECT COALESCE(SUM(total::numeric), 0) FROM ${orders} WHERE ${orders.paymentStatus} = 'paid') as "totalRevenue",
      (SELECT COALESCE(SUM(total::numeric), 0) FROM ${orders} WHERE ${orders.paymentStatus} = 'paid' AND ${orders.createdAt} >= ${thirtyDaysAgo}) as "recentRevenue",
      (SELECT count(*)::int FROM ${orders}) as "totalOrders",
      (SELECT count(*)::int FROM ${orders} WHERE ${orders.status} = 'pending') as "pendingOrders",
      (SELECT count(*)::int FROM ${products} WHERE ${products.status} = 'active' AND ${products.deletedAt} IS NULL) as "totalProducts",
      (SELECT count(*)::int FROM ${products} WHERE ${products.status} = 'active' AND ${products.deletedAt} IS NULL AND ${products.stock} <= ${products.lowStockThreshold}) as "lowStockProducts",
      (SELECT count(*)::int FROM ${user} WHERE ${user.role} = 'customer' AND ${user.deletedAt} IS NULL) as "totalCustomers",
      (SELECT count(*)::int FROM ${consultationRequests} WHERE ${consultationRequests.status} = 'pending') as "pendingConsultations"
  `);

  // db.execute returns an array of rows. We take the first one.
  const stats = result[0] as {
    totalRevenue: number;
    recentRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    lowStockProducts: number;
    totalCustomers: number;
    pendingConsultations: number;
  };

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
