import { Suspense } from "react";
import { getDashboardStats } from "@/lib/actions/admin";
import { getRecentOrders } from "@/lib/actions/admin";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatNaira } from "@/lib/utils";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(8),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back — here&apos;s what&apos;s happening today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatNaira(stats.totalRevenue)}
          sub={`₦${Number(stats.recentRevenue).toLocaleString()} last 30 days`}
          icon={TrendingUp}
          trend="up"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          sub={`${stats.pendingOrders} pending`}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.toLocaleString()}
          sub={
            stats.lowStockProducts > 0
              ? `${stats.lowStockProducts} low stock`
              : "All stocked"
          }
          icon={Package}
          trend={stats.lowStockProducts > 0 ? "down" : "neutral"}
          color={stats.lowStockProducts > 0 ? "amber" : "green"}
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers.toLocaleString()}
          sub={`${stats.pendingConsultations} pending consultations`}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Alerts */}
      {(stats.lowStockProducts > 0 || stats.pendingConsultations > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {stats.lowStockProducts > 0 && (
            <Link
              href="/admin/products?filter=low-stock"
              className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {stats.lowStockProducts} product
                  {stats.lowStockProducts > 1 ? "s" : ""} low on stock
                </p>
                <p className="text-xs text-amber-600">
                  Click to review inventory
                </p>
              </div>
            </Link>
          )}
          {stats.pendingConsultations > 0 && (
            <Link
              href="/admin/consultations"
              className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <MessageSquare className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  {stats.pendingConsultations} consultation
                  {stats.pendingConsultations > 1 ? "s" : ""} awaiting response
                </p>
                <p className="text-xs text-blue-600">Click to view requests</p>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-brand-green hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground">
                  Order
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs text-brand-green hover:underline font-semibold"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-xs truncate max-w-[140px]">
                      {order.shippingName}
                    </p>
                    <p className="text-muted-foreground text-xs truncate max-w-[140px]">
                      {order.shippingEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-xs">
                    {formatNaira(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
