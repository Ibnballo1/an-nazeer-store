// src/app/admin/dashboard/page.tsx
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders, products, user } from "@/db/schema";
import { sql, count, sum } from "drizzle-orm";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

async function getDashboardStats() {
  const [totalOrders] = await db.select({ count: count() }).from(orders);
  const [totalProducts] = await db.select({ count: count() }).from(products);
  const [totalCustomers] = await db.select({ count: count() }).from(user);
  const [revenue] = await db
    .select({ total: sum(orders.total) })
    .from(orders)
    .where(sql`${orders.paymentStatus} = 'paid'`);

  const recentOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      shippingName: orders.shippingName,
      total: orders.total,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(sql`${orders.createdAt} DESC`)
    .limit(8);

  return {
    totalOrders: totalOrders.count,
    totalProducts: totalProducts.count,
    totalCustomers: totalCustomers.count,
    revenue: Number(revenue.total ?? 0),
    recentOrders,
  };
}

const STATUS_CONFIG = {
  pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  processing: { color: "bg-purple-100 text-purple-700", icon: Package },
  shipped: { color: "bg-indigo-100 text-indigo-700", icon: Truck },
  delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-700", icon: AlertCircle },
  refunded: { color: "bg-stone-100 text-stone-600", icon: AlertCircle },
};

async function DashboardContent() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Revenue",
      value: `₦${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-[#0f7a3a]",
      change: "+12% this month",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "bg-blue-600",
      change: "+8% this month",
    },
    {
      label: "Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "bg-purple-600",
      change: "Active listings",
    },
    {
      label: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: "bg-amber-600",
      change: "+25 this week",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-stone-900">
          Dashboard Overview
        </h1>
        <p className="text-stone-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
          >
            <div
              className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-2xl text-stone-900 mb-0.5">
              {stat.value}
            </div>
            <div className="text-sm text-stone-500">{stat.label}</div>
            <div className="text-xs text-[#0f7a3a] mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-sm text-[#0f7a3a] font-medium hover:underline"
          >
            View all
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                {[
                  "Order",
                  "Customer",
                  "Total",
                  "Status",
                  "Payment",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-6 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {stats.recentOrders.map((order) => {
                const statusConfig =
                  STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const StatusIcon = statusConfig.icon;
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-stone-900">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      {order.shippingName}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-stone-900">
                      ₦{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/dashboard");
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Suspense
          fallback={<div className="p-6 text-stone-500">Loading stats...</div>}
        >
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
