import { sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isStrictAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Private download for the office. Strict admin only; served as an attachment, never rendered inline. */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isStrictAdminRequest(req))) return Response.json({ ok: false }, { status: 403 });
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return Response.json({ ok: false }, { status: 404 });
  await ensureDb();
  const r = await db.execute(sql`SELECT filename, mime, data FROM uploads WHERE id = ${id}`);
  const row = r.rows[0] as { filename: string; mime: string; data: Buffer } | undefined;
  if (!row) return Response.json({ ok: false }, { status: 404 });
  return new Response(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.mime,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(row.filename)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
