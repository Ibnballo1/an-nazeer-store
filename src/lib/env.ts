import { z } from "zod";

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),

  // Auth
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),

  // Paystack
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().startsWith("pk_"),
  PAYSTACK_SECRET_KEY: z.string().startsWith("sk_"),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(10),
});

// Validate on startup — throws with clear message if anything is missing
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error(
    "Environment variable validation failed. Check your .env.local",
  );
}

export const env = parsed.data;
