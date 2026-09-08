import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Do not throw during `next build` when Vercel has not injected runtime
// environment variables yet. Database access still requires DATABASE_URL;
// requests that actually touch the database will fail clearly if it is absent.
const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool(databaseUrl ? { connectionString: databaseUrl } : {});

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
