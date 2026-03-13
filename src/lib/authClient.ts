// src/lib/auth/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      phone: {
        type: "string",
      },
    },
  },
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
