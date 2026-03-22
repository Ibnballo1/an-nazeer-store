import { Metadata } from "next";
import { db } from "@/db";
import { user, orders } from "@/db/schema";
import { eq, desc, isNull, and, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/server";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Customers — Admin" };

export default async function AdminCustomersPage() {
  await requireAdmin();

  const customers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      orderCount: sql<number>`count(${orders.id})::int`,
    })
    .from(user)
    .leftJoin(orders, eq(orders.userId, user.id))
    .where(and(eq(user.role, "customer"), isNull(user.deletedAt)))
    .groupBy(user.id)
    .orderBy(desc(user.createdAt));

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {customers.length} registered customer
          {customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {["Customer", "Email", "Phone", "Orders", "Joined"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No customers yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green font-bold text-sm shrink-0">
                          {(c.name ?? c.email)[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-xs">
                          {c.name ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {c.email}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {c.phone ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge className="bg-brand-green-light text-brand-green border-0 text-xs">
                        {c.orderCount} order{c.orderCount !== 1 ? "s" : ""}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
