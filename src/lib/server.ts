import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";

/**
 * Get the current session — cached per request via React cache()
 * Safe to call multiple times in a single render without extra DB hits
 */
export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

/**
 * Get the current user or return null
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user ?? null;
}

/**
 * Require authentication — redirects to login if not authenticated
 */
export async function requireAuth(redirectTo = "/login") {
  const session = await getServerSession();
  if (!session) redirect(redirectTo);
  return session;
}

/**
 * Require admin role — redirects to home if not admin
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "admin") redirect("/");
  return session;
}

/**
 * Check if current user is admin (non-redirecting)
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}
