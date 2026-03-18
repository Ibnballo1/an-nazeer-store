import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCategories } from "@/lib/actions/products";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as any).role !== "admin") {
    redirect("/login?redirect=/admin/products/new");
  }

  const categories = await getCategories();

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm mb-3 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Products
          </Link>
          <h1 className="font-display text-2xl font-bold text-stone-900">Add New Product</h1>
        </div>
        <AdminProductForm categories={categories} />
      </main>
    </div>
  );
}