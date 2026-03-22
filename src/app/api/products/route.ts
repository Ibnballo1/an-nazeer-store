// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/actions/products";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const featured = searchParams.get("featured") === "true" ? true : undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  try {
    const products = await getProducts({
      categorySlug,
      search,
      featured,
      pageSize: limit,
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error("Products API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
