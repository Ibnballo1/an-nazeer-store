import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/server";
import { getUserOrders } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { Package, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await requireAuth("/login?redirect=/account");
  const orders = await getUserOrders();

  const totalSpent = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-brand-green rounded-2xl p-6 text-white">
        <p className="text-white/70 text-sm mb-1">Welcome back</p>
        <h1 className="font-display text-2xl font-bold">
          {session.user.name ?? session.user.email} 🌿
        </h1>
        <p className="text-white/70 text-sm mt-1">{session.user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="h-9 w-9 bg-brand-green-light rounded-xl flex items-center justify-center mb-3">
            <Package className="h-4 w-4 text-brand-green" />
          </div>
          <p className="text-2xl font-bold font-display">{orders.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="h-9 w-9 bg-brand-green-light rounded-xl flex items-center justify-center mb-3">
            <User className="h-4 w-4 text-brand-green" />
          </div>
          <p className="text-2xl font-bold font-display">
            {formatNaira(totalSpent)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Spent</p>
        </div>
      </div>

      {/* Recent orders preview */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Recent Orders</h2>
            <Link
              href="/account/orders"
              className="text-xs text-brand-green hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {orders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors"
              >
                <div>
                  <p className="font-mono text-xs font-bold text-brand-green">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {formatNaira(order.total)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {order.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/contact">Book Consultation</Link>
        </Button>
      </div>
    </div>
  );
}
