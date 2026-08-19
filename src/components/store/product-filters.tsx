"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { Category } from "@/db/schema";

type Props = { categories: Category[] };

export function ProductFilters({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // reset pagination
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "";
  const currentSearch = searchParams.get("search") ?? "";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          defaultValue={currentSearch}
          placeholder="Search products…"
          className="pl-9 rounded-xl"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam(
                "search",
                (e.target as HTMLInputElement).value || null,
              );
            }
          }}
        />
      </div>

      {/* Category filter */}
      <Select
        value={currentCategory || "_all"}
        onValueChange={(v) => updateParam("category", v === "_all" ? null : v)}
      >
        <SelectTrigger className="w-full sm:w-44 rounded-xl">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-brand-cream">
          <SelectItem value="_all" className="bg-white cursor-pointer">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug} className="bg-white cursor-pointer">
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={currentSort || "newest"}
        onValueChange={(v) => updateParam("sort", v === "newest" ? null : v)}
      >
        <SelectTrigger className="w-full sm:w-40 rounded-xl">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-brand-cream">
          <SelectItem value="newest" className="bg-brand-white">Newest</SelectItem>
          <SelectItem value="popular" className="bg-brand-white">Most Popular</SelectItem>
          <SelectItem value="price-asc" className="bg-brand-white">Price: Low to High</SelectItem>
          <SelectItem value="price-desc" className="bg-brand-white">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {(currentCategory || currentSearch || currentSort) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(pathname)}
          className="text-muted-foreground hover:text-foreground rounded-xl"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
