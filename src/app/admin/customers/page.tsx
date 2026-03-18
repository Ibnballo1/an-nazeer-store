import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, orders } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Users, User } from "lucide-react";

export default async function AdminCustomersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    redirect("/login?redirect=/admin/customers");
  }

  const customers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.role, "user"))
    .orderBy(desc(user.createdAt));

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-stone-900">
            Customers
          </h1>
          <p className="text-stone-500 text-sm">
            {customers.length} registered accounts
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50">
                <tr>
                  {["Customer", "Email", "Phone", "Joined", "Role"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-stone-500 uppercase tracking-wider px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-stone-400"
                    >
                      <Users className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                      No customers yet
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#0f7a3a]/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-[#0f7a3a] font-bold text-sm">
                              {customer.name?.[0]?.toUpperCase() ?? "?"}
                            </span>
                          </div>
                          <span className="font-medium text-stone-900 text-sm">
                            {customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {customer.phone ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-500">
                        {new Date(customer.createdAt).toLocaleDateString(
                          "en-NG",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium capitalize">
                          {customer.role}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
