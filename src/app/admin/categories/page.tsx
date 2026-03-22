import { Metadata } from "next";
import { getCategories } from "@/lib/actions/products";
import { requireAdmin } from "@/lib/server";
import { CategoryManager } from "./category-manager";

export const metadata: Metadata = { title: "Categories — Admin" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage product categories
        </p>
      </div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
