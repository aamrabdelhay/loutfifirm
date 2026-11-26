import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { FEATURE_ENTITIES } from "./server";

/** Rows of every feature entity, for the admin dashboard. */
export async function listFeatureEntities(): Promise<Record<string, unknown[]>> {
  await ensureDb();
  const out: Record<string, unknown[]> = {};
  for (const [key, def] of Object.entries(FEATURE_ENTITIES())) {
    const q = db.select().from(def.table);
    out[key] = await (def.orderBySort ? q.orderBy(asc(def.idColumn)) : q.orderBy(desc(def.idColumn)));
  }
  return out;
}
