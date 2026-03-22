import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/server";
import { StatusBadge } from "@/components/admin/status-badge";
import { OrderStatusUpdater } from "./order-status-updater";
import { formatNaira } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: { items: true, payments: true },
  });

  if (!order) notFound();

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold font-mono">
            {order.orderNumber}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-sm">
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-brand-cream flex items-center justify-center text-xl shrink-0">
                    🌿
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatNaira(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-sm shrink-0">
                    {formatNaira(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 bg-muted/30 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatNaira(order.shippingFee)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm text-brand-green">
                  <span>Discount</span>
                  <span>-{formatNaira(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1 border-t border-border">
                <span>Total</span>
                <span className="text-brand-green">
                  {formatNaira(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.payments.length > 0 && (
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold text-sm mb-4">Payment Details</h2>
              {order.payments.map((pay) => (
                <div key={pay.id} className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono text-xs">
                      {pay.paystackReference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="capitalize">{pay.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <StatusBadge status={pay.status} />
                  </div>
                  {pay.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid at</span>
                      <span className="text-xs">
                        {new Date(pay.paidAt).toLocaleString("en-NG")}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-sm mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-muted-foreground">{order.shippingEmail}</p>
              <p className="text-muted-foreground">{order.shippingPhone}</p>
              {!order.userId && (
                <span className="inline-block text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Guest Checkout
                </span>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-sm mb-4">Shipping Address</h2>
            <address className="not-italic text-sm text-muted-foreground leading-relaxed">
              {order.shippingAddress}
              <br />
              {order.shippingCity}, {order.shippingState}
              <br />
              {order.shippingCountry}
            </address>
            {order.trackingNumber && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Tracking</p>
                <p className="text-sm font-mono font-medium">
                  {order.trackingNumber}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {order.customerNote && (
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold text-sm mb-2">Customer Note</h2>
              <p className="text-sm text-muted-foreground">
                {order.customerNote}
              </p>
            </div>
          )}

          {/* Status Updater */}
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
            currentTracking={order.trackingNumber}
          />
        </div>
      </div>
    </div>
  );
}
