import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { adminGetAllProducts } from "@/lib/actions/products";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/products");
  }

  const products = await adminGetAllProducts();

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Products
            </h1>
            <p className="text-stone-500 text-sm">
              {products.length} products in total
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#0f7a3a] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a5c2c] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
        <AdminProductsTable products={products} />
      </main>
    </div>
  );
}
