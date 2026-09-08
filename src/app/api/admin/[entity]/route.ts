import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isAdminRequest } from "@/lib/auth";
import { SERVER_ENTITIES, sanitize } from "@/lib/server-entities";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ entity: string }> };

export async function POST(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const { entity } = await ctx.params;
  const def = SERVER_ENTITIES[entity];
  if (!def) return Response.json({ ok: false }, { status: 404 });
  try {
    await ensureDb();
    const body = (await req.json()) as Record<string, unknown>;
    const data = sanitize(def, body);
    const rows = (await db
      .insert(def.table)
      .values(data)
      .returning()) as unknown as Record<string, unknown>[];
    return Response.json({ ok: true, row: rows[0] ?? null });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "تعذر الحفظ" }, { status: 500 });
  }
}
