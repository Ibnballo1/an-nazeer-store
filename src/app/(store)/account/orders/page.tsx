import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/server";
import { getUserOrders } from "@/lib/actions/orders";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "My Orders",
};

export default async function AccountOrdersPage() {
  const session = await requireAuth("/login?redirect=/account/orders");
  const orders = await getUserOrders();

  return (
    <div className="container-safe py-8 md:py-12 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold">
            My Orders
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/shop">
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            Shop More
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-16 w-16 bg-brand-green-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-brand-green" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-2">
            No orders yet
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here.
          </p>
          <Button
            asChild
            className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
          >
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-border p-5 hover:shadow-soft transition-shadow"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-mono font-bold text-sm text-brand-green">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <StatusBadge status={order.paymentStatus} />
                </div>
              </div>

              {/* Order items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-brand-cream flex items-center justify-center text-lg shrink-0">
                        🌿
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × {formatNaira(item.unitPrice)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold shrink-0">
                      {formatNaira(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Order total</p>
                  <p className="font-bold text-brand-green">
                    {formatNaira(order.total)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Show tracking if available */}
                  {order.trackingNumber && (
                    <p className="text-xs text-muted-foreground">
                      Tracking:{" "}
                      <span className="font-mono font-medium text-foreground">
                        {order.trackingNumber}
                      </span>
                    </p>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                  >
                    <Link href={`/account/orders/${order.id}`}>
                      View Details
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
