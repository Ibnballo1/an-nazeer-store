import { Suspense } from "react";
import { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/actions/products";
import { ProductCard } from "@/components/store/product-card";
import { ProductFilters } from "@/components/store/product-filters";
import { Pagination } from "@/components/store/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Shop — Natural Herbal Products" };

type Props = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const categorySlug = params.category;
  const search = params.search;
  const sort = params.sort as
    | "newest"
    | "price-asc"
    | "price-desc"
    | "popular"
    | undefined;

  const [result, categories] = await Promise.all([
    getProducts({ page, pageSize: 12, categorySlug, search, sort }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  console.log(categories, "categories");

  return (
    <div className="container-safe py-8 md:py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-semibold">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {result.total} product{result.total !== 1 ? "s" : ""} found
          {search ? ` for "${search}"` : ""}
        </p>
      </div>

      {/* Filters */}
      <ProductFilters categories={categories} />

      {/* Grid */}
      <div className="mt-6">
        {result.data.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {result.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={result.page}
                totalPages={result.totalPages}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🌿</p>
            <h3 className="font-display text-xl font-semibold mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
