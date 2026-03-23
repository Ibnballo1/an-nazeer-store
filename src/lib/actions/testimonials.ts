"use server";

import { z } from "zod";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";
import type { Testimonial } from "@/db/schema";

const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  city: z.string().optional(),
  image: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  text: z.string().min(10, "Testimonial text is required"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Get active testimonials for homepage
// ─────────────────────────────────────────────────────────────────────────────

export async function getActiveTestimonials(limit = 6) {
  return db.query.testimonials.findMany({
    where: eq(testimonials.isActive, true),
    orderBy: [asc(testimonials.sortOrder), desc(testimonials.createdAt)],
    limit,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Get all testimonials
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllTestimonials() {
  await requireAdmin();

  return db.query.testimonials.findMany({
    orderBy: [asc(testimonials.sortOrder), desc(testimonials.createdAt)],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Create testimonial
// ─────────────────────────────────────────────────────────────────────────────

export async function createTestimonial(
  input: TestimonialInput,
): Promise<ActionResult<Testimonial>> {
  await requireAdmin();

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    const [testimonial] = await db
      .insert(testimonials)
      .values(parsed.data)
      .returning();

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { success: true, data: testimonial };
  } catch (err) {
    console.error("[createTestimonial]", err);
    return { success: false, error: "Failed to create testimonial." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Update testimonial
// ─────────────────────────────────────────────────────────────────────────────

export async function updateTestimonial(
  id: string,
  input: Partial<TestimonialInput>,
): Promise<ActionResult<Testimonial>> {
  await requireAdmin();

  try {
    const [testimonial] = await db
      .update(testimonials)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { success: true, data: testimonial };
  } catch (err) {
    console.error("[updateTestimonial]", err);
    return { success: false, error: "Failed to update testimonial." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Delete testimonial
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));

    revalidatePath("/");
    revalidatePath("/admin/testimonials");

    return { success: true, data: undefined };
  } catch (err) {
    console.error("[deleteTestimonial]", err);
    return { success: false, error: "Failed to delete testimonial." };
  }
}
