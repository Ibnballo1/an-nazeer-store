"use server";

import { db } from "@/db";
import { consultationRequests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

interface ConsultInput {
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: string;
  healthChallenge: string;
  currentMedications?: string;
  allergies?: string;
}

export async function submitConsultation(input: ConsultInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  await db.insert(consultationRequests).values({
    name: input.name,
    email: input.email,
    phone: input.phone,
    age: input.age,
    gender: input.gender,
    healthChallenge: input.healthChallenge,
    currentMedications: input.currentMedications,
    allergies: input.allergies,
    userId: session?.user?.id ?? null,
    status: "pending",
  });

  revalidatePath("/admin/consultations");
}

export async function adminGetConsultations() {
  const session = await auth.api.getSession({ headers: await headers() });
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  return db
    .select()
    .from(consultationRequests)
    .orderBy(desc(consultationRequests.createdAt));
}

export async function adminUpdateConsultation(
  id: string,
  data: {
    status?: "pending" | "reviewed" | "responded" | "closed";
    adminNotes?: string;
    response?: string;
  },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

  await db
    .update(consultationRequests)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(consultationRequests.id, id));

  revalidatePath("/admin/consultations");
}
