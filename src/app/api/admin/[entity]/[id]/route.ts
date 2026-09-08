import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isAdminRequest } from "@/lib/auth";
import { SERVER_ENTITIES, sanitize } from "@/lib/server-entities";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ entity: string; id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const { entity, id } = await ctx.params;
  const def = SERVER_ENTITIES[entity];
  const rowId = Number(id);
  if (!def || !Number.isFinite(rowId)) {
    return Response.json({ ok: false }, { status: 404 });
  }
  try {
    await ensureDb();
    const body = (await req.json()) as Record<string, unknown>;
    const data = sanitize(def, body);
    const rows = (await db
      .update(def.table)
      .set(data)
      .where(eq(def.idColumn, rowId))
      .returning()) as unknown as Record<string, unknown>[];
    return Response.json({ ok: true, row: rows[0] ?? null });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "تعذر التحديث" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const { entity, id } = await ctx.params;
  const def = SERVER_ENTITIES[entity];
  const rowId = Number(id);
  if (!def || !Number.isFinite(rowId)) {
    return Response.json({ ok: false }, { status: 404 });
  }
  try {
    await ensureDb();
    await db.delete(def.table).where(eq(def.idColumn, rowId));
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "تعذر الحذف" }, { status: 500 });
  }
}
