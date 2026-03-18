// src/types/index.ts
// Augment BetterAuth's User type to include our custom fields

import type { Session, User } from "better-auth";

declare module "better-auth" {
  interface User {
    role: "user" | "admin";
    phone?: string;
  }
}

// ── Re-exports for convenience ─────────────────────────────────────────────────
export type { Session, User };

// ── Cart ───────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  slug: string;
}

// ── API responses ──────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}