import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isAdminRequest, isStrictAdminRequest } from "@/lib/auth";
import { PII_ENTITIES } from "@/features/server";
import { getEntity, sanitize } from "@/lib/server-entities";
import { EntityValidationError } from "@/lib/entity-error";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ entity: string }> };

export async function POST(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const { entity } = await ctx.params;
  if (PII_ENTITIES.has(entity) && !(await isStrictAdminRequest(req))) {
    return Response.json({ ok: false, error: "هذه البيانات الشخصية تتطلب كلمة مرور إدارة فعلية وضبط ADMIN_SECRET" }, { status: 403 });
  }
  const def = getEntity(entity);
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
    if (err instanceof EntityValidationError) return Response.json({ ok: false, error: "قيمة غير صالحة: كود الدخول لا يقل عن 16 حرفًا" }, { status: 400 });
    console.error(err);
    return Response.json({ ok: false, error: "تعذر الحفظ" }, { status: 500 });
  }
}
