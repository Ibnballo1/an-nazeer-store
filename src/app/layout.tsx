import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

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
    default: "An-Nazeer Holistic Home | Natural Herbal Wellness",
    template: "%s | An-Nazeer Holistic Home",
  },
  description:
    "Nigeria's trusted herbal wellness brand. NAFDAC-approved natural remedies, food spices, beauty products, and health consultations.",
  keywords: [
    "herbal wellness Nigeria",
    "NAFDAC approved herbal products",
    "natural remedies Nigeria",
    "gorontula seed syrup",
    "herbal beauty products",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "An-Nazeer Holistic Home",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
