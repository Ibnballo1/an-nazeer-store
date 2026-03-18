// src/lib/auth/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, sessions, accounts, verifications } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  user: {
    additionalFields: {
      phone: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "customer" },
      defaultAddress: { type: "string", required: false },
      defaultCity: { type: "string", required: false },
      defaultState: { type: "string", required: false },
      deletedAt: { type: "date", required: false },
    },
  },
  //   sendVerificationOTP: async ({ identifier, otp }) => {
  //     await resend.emails.send({
  //  from: "Acme <onboarding@resend.dev>",
  //  to: user.email,
  //  subject: "Your Password Reset Code",
  //  html: `<p>Your OTP is: <b>${otp}</b></p>`,
  // });
  //     // For simplicity, we're just logging the OTP here.
  //     // In a real app, you'd send this via email or SMS.
  //     console.log(`Send OTP ${otp} to ${identifier}`);
  //   },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = typeof auth.$Infer.Session.user;
