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
    max: 10, // Limit the pool size to keep connections low
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = client;

export const db = drizzle(client, { schema });
export type DB = typeof db;
