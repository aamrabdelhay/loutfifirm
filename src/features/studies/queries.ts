import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { studies } from "./schema";

export async function listStudies() {
  await ensureDb();
  const rows = await db.select().from(studies).orderBy(asc(studies.sort), desc(studies.id));
  return rows.filter((r) => r.published);
}
