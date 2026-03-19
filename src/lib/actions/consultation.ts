"use server";

import { z } from "zod";
import { db } from "@/db";
import { consultationRequests } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/server";
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
// Explicit row type — mirrors schema columns exactly so TS resolves all fields
// ─────────────────────────────────────────────────────────────────────────────

export type ConsultationRow = {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  // REMOVED: subject, preferredContact, preferredTime, healthConcern
  // ADDED:
  age: number | null;
  gender: string | null;
  healthChallenge: string | null;
  currentMedications: string | null;
  allergies: string | null;

  message: string;
  status: ConsultationStatus;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

// ... rest of file unchanged
// ─────────────────────────────────────────────────────────────────────────────
// Zod schema
// ─────────────────────────────────────────────────────────────────────────────

const consultationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Please describe your concern (min 10 chars)"),
  healthConcern: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "whatsapp"]).default("email"),
  preferredTime: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC — Submit consultation request
// ─────────────────────────────────────────────────────────────────────────────

export async function submitConsultation(
  input: z.infer<typeof consultationSchema>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = consultationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ?? null;

  try {
    const [request] = await db
      .insert(consultationRequests)
      .values({ ...parsed.data, userId })
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
    with: { user: true },
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
