"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";
import type { Category } from "@/db/schema";

export async function createCategory(
  name: string,
): Promise<ActionResult<Category>> {
  await requireAdmin();

  const slug = slugify(name);
  try {
    const [cat] = await db
      .insert(categories)
      .values({ name, slug })
      .returning();
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true, data: cat };
  } catch {
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategory(
  id: string,
  name: string,
): Promise<ActionResult<Category>> {
  await requireAdmin();

  try {
    const [cat] = await db
      .update(categories)
      .set({ name, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true, data: cat };
  } catch {
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db
      .update(categories)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to delete category." };
  }
}
