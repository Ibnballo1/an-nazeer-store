import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/server";
import { getOrderById } from "@/lib/actions/orders";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import {
  ChevronLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = { title: "Order Details" };

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  await requireAuth("/login?redirect=/account/orders");

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const whatsappMsg = encodeURIComponent(
    `Hello! I'd like to enquire about my order: ${order.orderNumber}`,
  );

  return (
    <div className="container-safe py-8 md:py-12 max-w-3xl">
      {/* Back */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to My Orders
      </Link>

      {/* Order header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold font-mono text-brand-green">
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

      <div className="space-y-5">
        {/* Order items */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">
              Items ({order.items.length})
            </h2>
          </div>

          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="h-14 w-14 rounded-xl bg-brand-cream flex items-center justify-center text-2xl shrink-0">
                  🌿
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatNaira(item.unitPrice)} × {item.quantity}
                  </p>
                  {/* Link back to product if still exists */}
                  {item.productSlug && (
                    <Link
                      href={`/shop/${item.productSlug}`}
                      className="text-xs text-brand-green hover:underline mt-0.5 inline-block"
                    >
                      View product
                    </Link>
                  )}
                </div>
                <p className="font-bold text-sm shrink-0">
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
              <span>
                {Number(order.shippingFee) === 0 ? (
                  <span className="text-brand-green font-medium">Free</span>
                ) : (
                  formatNaira(order.shippingFee)
                )}
              </span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-sm text-brand-green">
                <span>Discount</span>
                <span>-{formatNaira(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-brand-green">
                {formatNaira(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-green" />
            Delivery Address
          </h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{order.shippingName}</p>
            <p>{order.shippingAddress}</p>
            <p>
              {order.shippingCity}, {order.shippingState}
            </p>
            <p>{order.shippingCountry}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={`mailto:${order.shippingEmail}`}
                className="flex items-center gap-1.5 text-xs hover:text-brand-green transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                {order.shippingEmail}
              </a>
              <a
                href={`tel:${order.shippingPhone}`}
                className="flex items-center gap-1.5 text-xs hover:text-brand-green transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                {order.shippingPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Tracking */}
        {order.trackingNumber && (
          <div className="bg-brand-green-light rounded-2xl border border-brand-green/20 p-5">
            <h2 className="font-semibold text-sm text-brand-green mb-1 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Tracking Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Tracking number:{" "}
              <span className="font-mono font-bold text-foreground">
                {order.trackingNumber}
              </span>
            </p>
          </div>
        )}

        {/* Customer note */}
        {order.customerNote && (
          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-sm mb-2">Your Note</h2>
            <p className="text-sm text-muted-foreground">
              {order.customerNote}
            </p>
          </div>
        )}

        {/* Help CTA */}
        <div className="bg-white rounded-2xl border border-border p-5 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Have a question about this order?
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
