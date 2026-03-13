// src/app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "An-Nazeer Holistic Home Ltd | Natural Wellness & Herbal Products",
    template: "%s | An-Nazeer Holistic Home",
  },
  description:
    "Certified herbal and natural wellness brand offering natural remedies, NAFDAC-approved food spices, beauty products, and herbal solutions. Trusted by thousands across Nigeria.",
  keywords: [
    "herbal products Nigeria",
    "natural wellness",
    "NAFDAC approved spices",
    "gorontula",
    "natural remedies",
    "herbal medicine Nigeria",
    "An-Nazeer",
  ],
  openGraph: {
    siteName: "An-Nazeer Holistic Home Ltd",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-stone-50 text-stone-900">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
