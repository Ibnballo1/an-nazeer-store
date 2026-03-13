// src/components/admin/admin-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Leaf,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { signOut } from "@/lib/authClient";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/consultations", label: "Consultations", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-stone-900 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-stone-800">
        <div className="w-8 h-8 bg-[#0f7a3a] rounded-lg flex items-center justify-center">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm font-display">
            An-Nazeer
          </div>
          <div className="text-stone-500 text-[10px] uppercase tracking-widest">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#0f7a3a] text-white"
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-stone-800 pt-3">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors mb-1"
        >
          <Leaf className="w-4 h-4" />
          View Store
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
