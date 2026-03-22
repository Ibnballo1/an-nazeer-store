"use server";

import { z } from "zod";
import { db } from "@/db";
import { consultationRequests } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "../server";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Shared status type
// ─────────────────────────────────────────────────────────────────────────────

export type ConsultationStatus =
  | "pending"
  | "contacted"
  | "scheduled"
  | "completed"
  | "cancelled";

// ─────────────────────────────────────────────────────────────────────────────
// Zod schema — matches actual DB columns exactly
// age is integer in DB so we coerce from string input
// ─────────────────────────────────────────────────────────────────────────────

const consultationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  age: z.coerce.number().int().positive().optional().nullable(),
  gender: z.string().optional().nullable(),
  message: z.string().min(10, "Please describe your concern"),
  healthChallenge: z.string().optional().nullable(),
  currentMedications: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Submit consultation request
// ─────────────────────────────────────────────────────────────────────────────

export async function submitConsultation(
  input: ConsultationInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = consultationSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  try {
    const [request] = await db
      .insert(consultationRequests)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        age: data.age ?? null,
        gender: data.gender ?? null,
        message: data.message,
        healthChallenge: data.healthChallenge ?? null,
        currentMedications: data.currentMedications ?? null,
        allergies: data.allergies ?? null,
      })
      .returning({ id: consultationRequests.id });

    revalidatePath("/admin/consultations");

    return { success: true, data: { id: request.id } };
  } catch (err) {
    console.error("[submitConsultation]", err);
    return { success: false, error: "Failed to submit. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Get all consultation requests (paginated)
// ─────────────────────────────────────────────────────────────────────────────

export async function getConsultations(opts: {
  page?: number;
  status?: string;
}) {
  await requireAdmin();

  const page = Math.max(1, opts.page ?? 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const rows = await db.query.consultationRequests.findMany({
    where:
      opts.status && opts.status !== "all"
        ? eq(consultationRequests.status, opts.status as ConsultationStatus)
        : undefined,
    orderBy: [desc(consultationRequests.createdAt)],
    limit: pageSize,
    offset,
  });

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(consultationRequests);

  return {
    data: rows,
    total: count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — Update consultation status + admin notes
// ─────────────────────────────────────────────────────────────────────────────

export async function updateConsultationStatus(
  id: string,
  status: ConsultationStatus,
  adminNotes?: string,
): Promise<ActionResult> {
  await requireAdmin();

  try {
    await db
      .update(consultationRequests)
      .set({
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
        updatedAt: new Date(),
      })
      .where(eq(consultationRequests.id, id));

    revalidatePath("/admin/consultations");
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[updateConsultationStatus]", err);
    return { success: false, error: "Failed to update status." };
  }
}
