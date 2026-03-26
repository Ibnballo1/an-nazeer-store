import Link from "next/link";
import { Leaf, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container-safe py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 bg-brand-green rounded-xl flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white leading-none">
                  An-Nazeer
                </p>
                <p className="text-[11px] text-white/50 leading-none mt-0.5">
                  Holistic Home Ltd
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Nigeria&apos;s trusted herbal wellness brand. NAFDAC-approved
              natural remedies, beauty products, and health consultations.
            </p>
            <div className="flex gap-3">
              {[
                { href: "https://instagram.com", label: "IG" },
                { href: "https://facebook.com", label: "FB" },
                { href: "https://twitter.com", label: "TW" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white/70 hover:bg-brand-green hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[
                {
                  href: "/shop?category=natural-remedies",
                  label: "Natural Remedies",
                },
                { href: "/shop?category=food-spices", label: "Food Spices" },
                {
                  href: "/shop?category=beauty-skincare",
                  label: "Beauty & Skincare",
                },
                {
                  href: "/shop?category=gorontula",
                  label: "Gorontula Products",
                },
                {
                  href: "/shop?category=natural-aphrodisiacs",
                  label: "Aphrodisiacs",
                },
                {
                  href: "/shop?category=wellness-solutions",
                  label: "Wellness Solutions",
                },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-brand-green transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/contact#consultation", label: "Book Consultation" },
                { href: "/contact#training", label: "Herbal Training" },
                { href: "/account/orders", label: "Track Order" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-brand-green transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />

                <a
                  href={`tel:+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  +234 816 455 0066
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                <a
                  href="mailto:oriyomianaseer@gmail.com"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  oriyomianaseer@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-green mt-1 shrink-0" />
                <span className="text-sm text-white/60 leading-relaxed max-w-[250px]">
                  Shop 664, Adura Bustop, Abeokuta Express Way, Beside Heyden
                  Filling Station, Lagos.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} An-Nazeer Holistic Home Ltd. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-brand-green font-medium">
              NAFDAC Approved ✓
            </span>
            <span className="text-xs text-white/40">
              NGN Payments via Paystack
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
