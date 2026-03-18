import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCategories } from "@/lib/actions/products";
import { AdminCategoriesClient } from "@/components/admin/admin-categories-client";

export default async function AdminCategoriesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/categories");
  }

  const categories = await getCategories();

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Categories
          </h1>
          <p className="text-stone-500 text-sm">
            {categories.length} categories
          </p>
        </div>
        <AdminCategoriesClient categories={categories} />
      </main>
    </div>
  );
}
