import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { adminGetAllOrders } from "@/lib/actions/orders";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";

export default async function AdminOrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/orders");
  }

  const orders = await adminGetAllOrders();

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Orders
          </h1>
          <p className="text-stone-500 text-sm">{orders.length} total orders</p>
        </div>
        <AdminOrdersTable orders={orders} />
      </main>
    </div>
  );
}
