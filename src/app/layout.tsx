import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f7a3a",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://an-nazeer.com",
  ),
  title: {
    default: "An-Nazeer Holistic Home | Natural Herbal Wellness Nigeria",
    template: "%s | An-Nazeer Holistic Home",
  },
  description:
    "Nigeria's trusted herbal wellness brand. NAFDAC-approved natural remedies, food spices, beauty products, and health consultations. Shop online, delivered nationwide.",
  keywords: [
    "herbal wellness Nigeria",
    "NAFDAC approved herbal products",
    "natural remedies Nigeria",
    "gorontula seed syrup",
    "herbal beauty products",
    "health consultation Nigeria",
    "natural aphrodisiacs Nigeria",
    "herbal food spices",
  ],
  authors: [{ name: "An-Nazeer Holistic Home Ltd" }],
  creator: "An-Nazeer Holistic Home Ltd",
  publisher: "An-Nazeer Holistic Home Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "An-Nazeer Holistic Home",
    title: "An-Nazeer Holistic Home | Natural Herbal Wellness Nigeria",
    description:
      "NAFDAC-approved herbal products, natural remedies, beauty solutions and health consultations. Delivered across Nigeria.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "An-Nazeer Holistic Home — Natural Herbal Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "An-Nazeer Holistic Home | Natural Herbal Wellness Nigeria",
    description: "NAFDAC-approved herbal products delivered across Nigeria.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
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
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
