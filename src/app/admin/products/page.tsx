// src/app/admin/products/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc, and, isNull, sql, ilike, or, asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/server";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";
import { Plus, Eye, Pencil, AlertTriangle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DeleteProductButton } from "./delete-product-button";

export const metadata: Metadata = { title: "Products — Admin" };

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    filter?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 30;
const PRODUCT_STATUSES = ["active", "draft", "archived"] as const;

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const query = params.q?.trim().slice(0, 100) ?? "";
  const status = PRODUCT_STATUSES.find((value) => value === params.status);
  const pageParam = Number.parseInt(params.page ?? "1", 10);
  const requestedPage = Number.isFinite(pageParam) ? Math.max(1, pageParam) : 1;

  const categoryRows = await db.query.categories.findMany({
    where: isNull(categories.deletedAt),
    orderBy: [asc(categories.name)],
    columns: { id: true, name: true },
  });
  const categoryId = categoryRows.some((category) => category.id === params.category)
    ? params.category
    : undefined;

  const conditions = [isNull(products.deletedAt)];
  if (query) {
    conditions.push(
      or(ilike(products.name, `%${query}%`), ilike(products.slug, `%${query}%`))!,
    );
  }
  if (categoryId) conditions.push(eq(products.categoryId, categoryId));
  if (status) conditions.push(eq(products.status, status));
  if (params.filter === "low-stock") {
    conditions.push(sql`${products.trackInventory} = true`);
    conditions.push(sql`${products.stock} <= ${products.lowStockThreshold}`);
  }

  const where = and(...conditions);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(where);
  const totalPages = Math.ceil(count / PAGE_SIZE);
  const currentPage = totalPages ? Math.min(requestedPage, totalPages) : 1;

  const rows = await db.query.products.findMany({
    where,
    orderBy: [desc(products.createdAt)],
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
    with: { category: true },
  });

  function pageHref(page: number) {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (categoryId) search.set("category", categoryId);
    if (status) search.set("status", status);
    if (params.filter === "low-stock") search.set("filter", "low-stock");
    search.set("page", String(page));
    return `/admin/products?${search.toString()}`;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {count} product{count !== 1 ? "s" : ""} found
            {totalPages > 0 ? ` · Page ${currentPage} of ${totalPages}` : ""}
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

      {/* Search and filters */}
      <form method="GET" className="mb-6 rounded-2xl border border-border bg-white p-4">
        <input type="hidden" name="page" value="1" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(220px,1fr)_200px_160px_160px_auto_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search product name or slug..."
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <select
            name="category"
            defaultValue={categoryId ?? ""}
            aria-label="Filter by category"
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">All categories</option>
            {categoryRows.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={status ?? ""}
            aria-label="Filter by status"
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">All statuses</option>
            {PRODUCT_STATUSES.map((value) => (
              <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>
            ))}
          </select>
          <select
            name="filter"
            defaultValue={params.filter === "low-stock" ? "low-stock" : ""}
            aria-label="Filter by stock level"
            className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="">All stock levels</option>
            <option value="low-stock">Low stock</option>
          </select>
          <Button type="submit" className="h-10 bg-brand-green text-white hover:bg-brand-green-dark">
            Apply
          </Button>
          <Button asChild type="button" variant="outline" className="h-10">
            <Link href="/admin/products">Clear</Link>
          </Button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {["Product", "Category", "Location prices", "Stock", "Status", ""].map(
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
                        <span className="block">Alagbado: {formatNaira(product.alagbadoPrice)}</span>
                        <span className="block text-muted-foreground font-normal">Ogba: {formatNaira(product.ogbaPrice)}</span>
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

      {totalPages > 1 && (
        <nav aria-label="Product pages" className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, count)} of {count}
          </p>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" disabled={currentPage <= 1}>
              <Link href={pageHref(Math.max(1, currentPage - 1))} aria-disabled={currentPage <= 1}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Link>
            </Button>
            <span className="px-2 text-sm text-muted-foreground">{currentPage} / {totalPages}</span>
            <Button asChild variant="outline" size="sm" disabled={currentPage >= totalPages}>
              <Link href={pageHref(Math.min(totalPages, currentPage + 1))} aria-disabled={currentPage >= totalPages}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
