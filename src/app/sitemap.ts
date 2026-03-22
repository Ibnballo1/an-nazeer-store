import { MetadataRoute } from "next";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, isNull, and } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://an-nazeer.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic product pages
  const productRows = await db.query.products.findMany({
    where: and(eq(products.status, "active"), isNull(products.deletedAt)),
    columns: { slug: true, updatedAt: true },
  });

  const productPages: MetadataRoute.Sitemap = productRows.map((p) => ({
    url: `${BASE_URL}/shop/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic category pages
  const categoryRows = await db.query.categories.findMany({
    where: and(eq(categories.isActive, true), isNull(categories.deletedAt)),
    columns: { slug: true, updatedAt: true },
  });

  const categoryPages: MetadataRoute.Sitemap = categoryRows.map((c) => ({
    url: `${BASE_URL}/shop?category=${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
