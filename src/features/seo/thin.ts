import { sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";

/** True when a content table has no rows. Used to keep empty placeholder pages out of search results. */
export async function isEmptyTable(table: string): Promise<boolean> {
  try {
    await ensureDb();
    const r = await db.execute(sql.raw(`SELECT 1 FROM ${table} LIMIT 1`));
    return r.rows.length === 0;
  } catch { return false; }
}
