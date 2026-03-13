// src/lib/actions/products.ts
"use server";

import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc, ilike, and, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { headers } from "next/headers";

// ─── Public actions ───────────────────────────────────────────────────────────

export async function getProducts(params?: {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
}) {
  const conditions = [eq(products.isActive, true)];

  if (params?.featured) conditions.push(eq(products.isFeatured, true));

  if (params?.search) {
    conditions.push(
      or(
        ilike(products.name, `%${params.search}%`),
        ilike(products.description, `%${params.search}%`),
      )!,
    );
  }

  if (params?.categorySlug) {
    const cat = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, params.categorySlug))
      .limit(1);
    if (cat[0]) conditions.push(eq(products.categoryId, cat[0].id));
  }

  const query = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      shortDescription: products.shortDescription,
      price: products.price,
      comparePrice: products.comparePrice,
      images: products.images,
      stock: products.stock,
      isFeatured: products.isFeatured,
      isNafdacApproved: products.isNafdacApproved,
      rating: products.rating,
      reviewCount: products.reviewCount,
      categoryId: products.categoryId,
    })
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.createdAt));

  if (params?.limit) query.limit(params.limit);

  return query;
}

export async function getProductBySlug(slug: string) {
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  return result[0] ?? null;
}

export async function getCategories() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.sortOrder);
}

// ─── Admin actions (protected) ────────────────────────────────────────────────

async function requireAdmin() {
  // Add 'await' here because headers() is now async
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function adminCreateProduct(data: {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: string;
  comparePrice?: string;
  images?: string[];
  categoryId?: string;
  stock: number;
  benefits?: string[];
  ingredients?: string[];
  usage?: string;
  isNafdacApproved?: boolean;
  nafdacNumber?: string;
  isFeatured?: boolean;
}) {
  await requireAdmin();

  const result = await db.insert(products).values(data).returning();
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return result[0];
}

export async function adminUpdateProduct(
  id: string,
  data: Partial<typeof products.$inferInsert>,
) {
  await requireAdmin();
  const result = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return result[0];
}

export async function adminDeleteProduct(id: string) {
  await requireAdmin();
  await db
    .update(products)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function adminGetAllProducts() {
  await requireAdmin();
  return db.select().from(products).orderBy(desc(products.createdAt));
}
