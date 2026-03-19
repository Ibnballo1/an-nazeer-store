// src/app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPayment } from "@/lib/actions/orders";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  const ref = reference ?? trxref;

  if (!ref) {
    return NextResponse.redirect(new URL("/cart", request.url));
  }

  try {
    const result = await verifyOrderPayment(ref);

    if (result.success && result.order) {
      return NextResponse.redirect(
        new URL(
          `/order-success?order=${result.order.orderNumber}&ref=${ref}`,
          request.url,
        ),
      );
    }

    return NextResponse.redirect(
      new URL(`/checkout?payment_failed=true&ref=${ref}`, request.url),
    );
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.redirect(
      new URL("/checkout?payment_error=true", request.url),
    );
  }
}
