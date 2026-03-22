// src/components/layout/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Leaf, Search, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useSession, signOut } from "@/lib/authClient";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#0f7a3a] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <div
                className={`font-display text-base font-bold leading-none transition-colors ${
                  scrolled || !isHome ? "text-[#0f7a3a]" : "text-white"
                }`}
              >
                An-Nazeer
              </div>
              <div
                className={`text-[10px] tracking-widest uppercase leading-none transition-colors ${
                  scrolled || !isHome ? "text-stone-500" : "text-white/80"
                }`}
              >
                Holistic Home
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${
                  scrolled || !isHome
                    ? "text-stone-700 hover:text-[#0f7a3a]"
                    : "text-white/90 hover:text-white"
                } ${pathname === link.href ? "text-[#0f7a3a]" : ""}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-[#0f7a3a] transition-all duration-200 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className={`hidden md:flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                scrolled || !isHome
                  ? "text-stone-600 hover:bg-stone-100"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Search className="w-4.5 h-4.5" />
            </Link>

            {session ? (
              <div className="hidden md:flex items-center gap-2">
                {(session.user as any).role === "admin" && (
                  <Link
                    href="/admin/dashboard"
                    className="text-xs font-medium px-3 py-1.5 bg-[#0f7a3a] text-white rounded-full hover:bg-[#0a5c2c] transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    scrolled || !isHome ? "text-stone-600" : "text-white/80"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{session.user.name?.split(" ")[0]}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  scrolled || !isHome
                    ? "text-stone-600 hover:text-[#0f7a3a]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Cart button */}
            <Link
              href="/cart"
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                scrolled || !isHome
                  ? "text-stone-700 hover:bg-stone-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#0f7a3a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                scrolled || !isHome
                  ? "text-stone-700 hover:bg-stone-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } bg-white border-t border-stone-100`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[#0f7a3a]/10 text-[#0f7a3a]"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-stone-100 mt-2">
            {session ? (
              <button
                onClick={() => signOut()}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Sign Out ({session.user.name?.split(" ")[0]})
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-white bg-[#0f7a3a] text-center mt-2"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
