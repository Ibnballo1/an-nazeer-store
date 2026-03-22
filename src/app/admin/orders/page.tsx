import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getAllOrders } from "@/lib/actions/orders";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { Eye } from "lucide-react";

export const metadata: Metadata = { title: "Orders — Admin" };

type Props = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const result = await getAllOrders({
    page: Number(params.page ?? 1),
    status: params.status,
  });

  const STATUS_TABS = [
    "all",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {result.total} total orders
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {STATUS_TABS.map((s) => {
          const active = (params.status ?? "all") === s;
          return (
            <Link
              key={s}
              href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                active
                  ? "bg-brand-green text-white"
                  : "bg-white border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  "Order #",
                  "Customer",
                  "Items",
                  "Total",
                  "Status",
                  "Payment",
                  "Date",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {result.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                result.data.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-bold text-brand-green">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-xs">
                        {order.shippingName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {order.shippingEmail}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-3 font-semibold text-xs">
                      {formatNaira(order.total)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                      >
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
