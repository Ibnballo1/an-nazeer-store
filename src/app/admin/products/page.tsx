import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc, and, isNull, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/server";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";
import { Plus, Eye, Pencil, AlertTriangle } from "lucide-react";
import { DeleteProductButton } from "./delete-product-button";

export const metadata: Metadata = { title: "Products — Admin" };

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;

  const rows = await db.query.products.findMany({
    where: and(
      isNull(products.deletedAt),
      params.filter === "low-stock"
        ? sql`${products.stock} <= ${products.lowStockThreshold}`
        : undefined,
    ),
    orderBy: [desc(products.createdAt)],
    with: { category: true },
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {rows.length} product{rows.length !== 1 ? "s" : ""}
            {params.filter === "low-stock" ? " — low stock" : ""}
          </p>
        </div>
        <Button
          asChild
          className="bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
          size="sm"
        >
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { label: "All", href: "/admin/products" },
          { label: "Low Stock", href: "/admin/products?filter=low-stock" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              (params.filter ?? "") ===
              (href.includes("low-stock") ? "low-stock" : "")
                ? "bg-brand-green text-white"
                : "bg-white border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {["Product", "Category", "Price", "Stock", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                rows.map((product) => {
                  const isLowStock =
                    product.trackInventory &&
                    product.stock <= product.lowStockThreshold;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-brand-cream flex items-center justify-center text-lg shrink-0">
                            🌿
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-xs line-clamp-1">
                              {product.name}
                            </p>
                            {product.isFeatured && (
                              <Badge className="text-[10px] bg-brand-green-light text-brand-green border-0 px-1.5 py-0 mt-0.5">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        {product.category?.name ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-xs font-semibold">
                        {formatNaira(product.price)}
                        {product.comparePrice && (
                          <span className="text-muted-foreground line-through ml-1.5 font-normal">
                            {formatNaira(product.comparePrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          {isLowStock && (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          <span
                            className={`text-xs font-medium ${isLowStock ? "text-amber-600" : ""}`}
                          >
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Link
                              href={`/shop/${product.slug}`}
                              target="_blank"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Link href={`/admin/products/${product.id}`}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
