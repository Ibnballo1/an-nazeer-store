// src/components/layout/footer.tsx
import Link from "next/link";
import { Leaf, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-[#0f7a3a] rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display text-white font-bold text-sm">
                  An-Nazeer
                </div>
                <div className="text-[10px] tracking-widest text-stone-500 uppercase">
                  Holistic Home
                </div>
              </div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Certified herbal and natural wellness brand serving Nigeria with
              quality, integrity, and care.
            </p>
            <a
              href="https://wa.me/2348000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#22c35e] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Us
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/contact#consultation", label: "Consultation" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-[#0f7a3a] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {[
                "Herbs",
                "Food Spices",
                "Beauty Products",
                "Gorontula Products",
                "Wellness Remedies",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/shop?category=${cat.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm hover:text-[#0f7a3a] transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 text-[#0f7a3a] shrink-0 mt-0.5" />
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 text-[#0f7a3a] shrink-0 mt-0.5" />
                <span>info@annazeer.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[#0f7a3a] shrink-0 mt-0.5" />
                <span>Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} An-Nazeer Holistic Home Ltd. All rights
            reserved.
          </p>
          <p>NAFDAC Approved | Certified Herbal Practitioners</p>
        </div>
      </div>
    </footer>
  );
}
