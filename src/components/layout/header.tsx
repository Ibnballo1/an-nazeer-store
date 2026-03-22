import Link from "next/link";
import { getCart } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/server";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { ShoppingBag, Search, Leaf } from "lucide-react";

export async function Header() {
  const [cart, user] = await Promise.all([getCart(), getCurrentUser()]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container-safe">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-brand-green text-base leading-none">
                An-Nazeer
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Holistic Home Ltd
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "/shop", label: "Shop" },
              { href: "/shop?category=natural-remedies", label: "Remedies" },
              { href: "/shop?category=gorontula", label: "Gorontula" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-brand-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-foreground/60" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4 text-foreground/60" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.itemCount > 9 ? "9+" : cart.itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            <UserMenu />

            {/* Mobile menu */}
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
