"use server";

import { z } from "zod";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAdmin } from "../server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(255).optional(),
  body: z.string().optional(),
  reviewerName: z.string().min(2).optional(),
  reviewerEmail: z.string().email().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Submit review (authenticated or guest)
// ─────────────────────────────────────────────────────────────────────────────

export async function submitReview(
  input: z.infer<typeof reviewSchema>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ?? null;

  try {
    const [review] = await db
      .insert(reviews)
      .values({
        ...parsed.data,
        userId,
        isApproved: false, // admin must approve
      })
      .returning({ id: reviews.id });

    revalidatePath(`/shop/${parsed.data.productId}`);
    return { success: true, data: { id: review.id } };
  } catch (err) {
    console.error("[submitReview]", err);
    return { success: false, error: "Failed to submit review." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Approve review
// ─────────────────────────────────────────────────────────────────────────────

export async function approveReview(id: string): Promise<ActionResult> {
  await requireAdmin();

  await db
    .update(reviews)
    .set({ isApproved: true, updatedAt: new Date() })
    .where(eq(reviews.id, id));

  revalidatePath("/admin");
  return { success: true, data: undefined };
}
