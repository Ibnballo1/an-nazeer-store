"use client";

import { useState, useTransition } from "react";
import { Search, ChevronDown } from "lucide-react";
import { updateOrderStatus } from "@/lib/actions/orders";
import { toast } from "sonner";
import type { Order } from "@/db/schema";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-stone-100 text-stone-600",
};

interface Props {
  orders: Order[];
}

export function AdminOrdersTable({ orders }: Props) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingName.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingEmail.toLowerCase().includes(search.toLowerCase()),
  );

  function handleStatusChange(
    orderId: string,
    newStatus: (typeof ORDER_STATUSES)[number],
  ) {
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus);
        toast.success("Order status updated.");
      } catch {
        toast.error("Failed to update status.");
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 bg-stone-50"
          />
        </div>
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
                "Update",
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
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-stone-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-semibold text-stone-900">
                  #{order.orderNumber}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-stone-900">
                    {order.shippingName}
                  </p>
                  <p className="text-xs text-stone-500">
                    {order.shippingEmail}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-stone-900">
                  ₦{Number(order.total).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] ?? ""}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
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
                <td className="px-6 py-4">
                  <div className="relative">
                    <select
                      defaultValue={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as (typeof ORDER_STATUSES)[number],
                        )
                      }
                      disabled={isPending}
                      className="appearance-none bg-stone-50 border border-stone-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#0f7a3a]/30 cursor-pointer disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
