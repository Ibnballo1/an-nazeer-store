import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { resend } from "@/lib/email/resend";
import { resetPasswordEmailHtml } from "@/lib/email/templates/reset-password";

export const auth = betterAuth({
  // ── Database ──────────────────────────────────────────────────────────────
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  // ── App URL ───────────────────────────────────────────────────────────────
  baseURL: process.env.BETTER_AUTH_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: [
    "https://annazeerholistichomeltd.com",
    "https://www.annazeerholistichomeltd.com",
  ],

  // ── Email & Password ──────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    sendResetPassword: async ({ user, url }) => {
      try {
        const { error } = await resend.emails.send({
          from: `An-Nazeer Holistic Home <${process.env.RESEND_FROM_EMAIL ?? "noreply@an-nazeer.com"}>`,
          to: [user.email],
          subject: "Reset your An-Nazeer password",
          html: resetPasswordEmailHtml({
            name: user.name ?? "",
            url,
          }),
        });

        if (error) {
          console.error("[sendResetPassword] Resend error:", error);
        } else {
          console.log(`[sendResetPassword] Email sent to ${user.email}`);
        }
      } catch (err) {
        console.error("[sendResetPassword] Unexpected error:", err);
      }
    },
  },

  // ── Session ───────────────────────────────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Refresh if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-minute cookie cache
    },
  },

  // ── Extra User Fields ─────────────────────────────────────────────────────
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
      },
      defaultAddress: {
        type: "string",
        required: false,
      },
      defaultCity: {
        type: "string",
        required: false,
      },
      defaultState: {
        type: "string",
        required: false,
      },
      deletedAt: {
        type: "date",
        required: false,
      },
    },
  },

  // ── Cookies ───────────────────────────────────────────────────────────────
  advanced: {
    cookiePrefix: "an-nazeer",
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof schema.user.$inferSelect;
