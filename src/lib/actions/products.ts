"use server";

import { db } from "@/db";
import { products, categories, reviews } from "@/db/schema";
import {
  and,
  eq,
  ilike,
  desc,
  asc,
  sql,
  inArray,
  gt,
  isNull,
} from "drizzle-orm";
import { productSchema, type ProductInput } from "../validations/product";
import { requireAdmin } from "../server";
import { slugify } from "../utils";
import { revalidatePath } from "next/cache";
import type { ActionResult, PaginatedResult } from "@/types";
import type { Product } from "@/db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Get paginated products for shop page
// ─────────────────────────────────────────────────────────────────────────────

export async function getProducts(opts: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  featured?: boolean;
}): Promise<PaginatedResult<Product>> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(48, opts.pageSize ?? 12);
  const offset = (page - 1) * pageSize;

  // Build where conditions
  const conditions = [
    eq(products.status, "active"),
    isNull(products.deletedAt),
  ];

  if (opts.featured) {
    conditions.push(eq(products.isFeatured, true));
  }

  if (opts.search) {
    conditions.push(ilike(products.name, `%${opts.search}%`));
  }

  if (opts.categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, opts.categorySlug),
    });
    if (category) {
      conditions.push(eq(products.categoryId, category.id));
    }
  }

  // Sort order
  const orderBy = (() => {
    switch (opts.sort) {
      case "price-asc":
        return asc(products.price);
      case "price-desc":
        return desc(products.price);
      case "popular":
        return desc(products.isBestSeller);
      default:
        return desc(products.createdAt);
    }
  })();

  const [rows, [{ count }]] = await Promise.all([
    db.query.products.findMany({
      where: and(...conditions),
      orderBy: [orderBy],
      limit: pageSize,
      offset,
      with: { category: true },
    }),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(and(...conditions)),
  ]);

  return {
    data: rows,
    total: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Get a single product by slug
// ─────────────────────────────────────────────────────────────────────────────

export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: and(
      eq(products.slug, slug),
      eq(products.status, "active"),
      isNull(products.deletedAt),
    ),
    with: {
      category: true,
      reviews: {
        where: and(eq(reviews.isApproved, true), isNull(reviews.deletedAt)),
        orderBy: [desc(reviews.createdAt)],
        limit: 10,
      },
    },
  });

  return product ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Get featured products for homepage
// ─────────────────────────────────────────────────────────────────────────────

export async function getFeaturedProducts(limit = 8) {
  return db.query.products.findMany({
    where: and(
      eq(products.status, "active"),
      eq(products.isFeatured, true),
      isNull(products.deletedAt),
    ),
    orderBy: [desc(products.isBestSeller), desc(products.createdAt)],
    limit,
    with: { category: true },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Get all active categories
// ─────────────────────────────────────────────────────────────────────────────

export async function getCategories() {
  return db.query.categories.findMany({
    where: and(eq(categories.isActive, true), isNull(categories.deletedAt)),
    orderBy: [asc(categories.sortOrder)],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Create product
// ─────────────────────────────────────────────────────────────────────────────

export async function createProduct(
  input: ProductInput,
): Promise<ActionResult<Product>> {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  const slug = slugify(data.name);

  // Ensure slug is unique
  const existing = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  try {
    const [product] = await db
      .insert(products)
      .values({
        ...data,
        slug: finalSlug,
        price: String(data.price),
        comparePrice: data.comparePrice ? String(data.comparePrice) : null,
        costPrice: data.costPrice ? String(data.costPrice) : null,
        weight: data.weight ? String(data.weight) : null,
      })
      .returning();

    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return { success: true, data: product };
  } catch (err) {
    console.error("[createProduct]", err);
    return { success: false, error: "Failed to create product." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Update product
// ─────────────────────────────────────────────────────────────────────────────

export async function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<ActionResult<Product>> {
  await requireAdmin();

  try {
    const updateData: Record<string, unknown> = {
      ...input,
      updatedAt: new Date(),
    };

    // Coerce numeric fields to strings for Drizzle numeric columns
    if (input.price !== undefined) updateData.price = String(input.price);
    if (input.comparePrice !== undefined)
      updateData.comparePrice = input.comparePrice
        ? String(input.comparePrice)
        : null;
    if (input.costPrice !== undefined)
      updateData.costPrice = input.costPrice ? String(input.costPrice) : null;
    if (input.weight !== undefined)
      updateData.weight = input.weight ? String(input.weight) : null;

    const [product] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    revalidatePath("/shop");
    revalidatePath(`/shop/${product.slug}`);
    revalidatePath("/admin/products");

    return { success: true, data: product };
  } catch (err) {
    console.error("[updateProduct]", err);
    return { success: false, error: "Failed to update product." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Soft delete product
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db
      .update(products)
      .set({ deletedAt: new Date(), status: "archived" })
      .where(eq(products.id, id));

    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return { success: true, data: undefined };
  } catch (err) {
    console.error("[deleteProduct]", err);
    return { success: false, error: "Failed to delete product." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Update stock
// ─────────────────────────────────────────────────────────────────────────────

export async function updateStock(
  id: string,
  delta: number, // positive = add stock, negative = deduct
): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db
      .update(products)
      .set({
        stock: sql`GREATEST(0, ${products.stock} + ${delta})`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    revalidatePath("/admin/products");
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[updateStock]", err);
    return { success: false, error: "Failed to update stock." };
  }
}
