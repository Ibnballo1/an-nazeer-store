"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  MessageSquare,
  Leaf,
  LogOut,
  ChevronRight,
  BarChart3,
  Star,
} from "lucide-react";
import { signOut } from "@/lib/authClient";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
  { href: "/admin/consultations", icon: MessageSquare, label: "Consultations" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-brand-black border-r border-white/10 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <div className="h-8 w-8 bg-brand-green rounded-lg flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-none">
              An-Nazeer
            </p>
            <p className="text-[10px] text-white/40 leading-none mt-0.5">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-green text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-brand-black border-b border-white/10 h-14 flex items-center px-4 gap-3">
        <div className="h-7 w-7 bg-brand-green rounded-lg flex items-center justify-center">
          <Leaf className="h-3.5 w-3.5 text-white" />
        </div>
        <p className="font-display font-bold text-white text-sm flex-1">
          Admin
        </p>
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors",
                  active
                    ? "bg-brand-green text-white"
                    : "text-white/50 hover:text-white",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
