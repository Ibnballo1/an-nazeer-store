import { requireAuth } from "@/lib/server";
import Link from "next/link";
import { Package, User } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth("/login?redirect=/account");

  return (
    <div className="container-safe py-8 md:py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-48 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar">
            {[
              { href: "/account", icon: User, label: "My Account" },
              { href: "/account/orders", icon: Package, label: "My Orders" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-brand-green hover:bg-brand-green-light transition-colors shrink-0"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
