// src/lib/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// This prevents multiple connections during hot reloading in development
const globalForDb = global as unknown as {
  conn: postgres.Sql | undefined;
};

// Use existing connection or create a new one
const client =
  globalForDb.conn ??
  postgres(connectionString, {
    prepare: false,
    max: process.env.NODE_ENV === "production" ? 1 : 10,
    // Increase these to give the pooler more breathing room
    connect_timeout: 30, // 30 seconds instead of 10
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = client;

export const db = drizzle(client, { schema });
export type DB = typeof db;
