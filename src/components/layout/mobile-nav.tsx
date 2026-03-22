"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf } from "lucide-react";

const NAV_LINKS = [
  { href: "/shop", label: "🛍 Shop All Products" },
  { href: "/shop?category=natural-remedies", label: "🌿 Natural Remedies" },
  { href: "/shop?category=food-spices", label: "🌶 Food Spices" },
  { href: "/shop?category=beauty-skincare", label: "✨ Beauty & Skincare" },
  { href: "/shop?category=gorontula", label: "🌰 Gorontula Products" },
  {
    href: "/shop?category=natural-aphrodisiacs",
    label: "💚 Natural Aphrodisiacs",
  },
  { href: "/about", label: "ℹ About Us" },
  { href: "/contact", label: "📞 Contact & Consultation" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-border">
          <div className="h-9 w-9 bg-brand-green rounded-xl flex items-center justify-center">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-brand-green leading-none">
              An-Nazeer
            </p>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">
              Holistic Home Ltd
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-brand-green-light hover:text-brand-green transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="p-4 border-t border-border">
          <Button
            asChild
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white rounded-xl"
          >
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp Us
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
