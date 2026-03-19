"use server";

import { db } from "@/db";
import { consultationRequests } from "@/db/schema";
import { eq, desc, InferInsertModel } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { type User } from "@/lib/auth";

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
  try {
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
      message: `Health Challenge: ${input.healthChallenge}`, // Filling the 'notNull' message field
    });

    revalidatePath("/admin/consultations");
    return { success: true };
  } catch (error) {
    console.error("Submission Error:", error);
    return { success: false, error: "Failed to submit request" };
  }
}

export async function adminUpdateConsultation(
  id: string,
  data: Partial<
    Pick<InferInsertModel<typeof consultationRequests>, "status" | "adminNotes">
  >,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as User;

  if (user?.role !== "admin") throw new Error("Unauthorized");

  try {
    await db
      .update(consultationRequests)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(consultationRequests.id, id));

    revalidatePath("/admin/consultations");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update consultation" };
  }
}
