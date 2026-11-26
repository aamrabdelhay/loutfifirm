import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureDb, featureDdlErrors } from "@/db/bootstrap";

export const dynamic = "force-dynamic";

/** ok:true only when the database answers AND every feature migration succeeded. Failed feature names are listed. */
export async function GET() {
  try {
    await ensureDb();
    await db.execute(sql`select 1`);
    const failed = Object.keys(featureDdlErrors);
    if (failed.length) return Response.json({ ok: false, status: "degraded", failedFeatures: failed }, { status: 503 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
