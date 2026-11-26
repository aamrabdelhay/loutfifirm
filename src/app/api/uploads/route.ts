import { sameOriginOk } from "@/lib/same-origin";
import crypto from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { safeName, uploadsEnabled, validateFile } from "@/features/uploads/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ enabled: uploadsEnabled() });
}

/** multipart: file + kind ("intake" | "cv"). Returns an id that the form submits with the request. */
export async function POST(req: Request) {
  if (!uploadsEnabled()) return Response.json({ ok: false, error: "رفع الملفات غير مفعّل" }, { status: 501 });
  if (!rateLimit(`upload:${clientKey(req)}`, 8, 15 * 60_000)) return Response.json({ ok: false, error: "محاولات كثيرة" }, { status: 429 });
  if (!sameOriginOk(req)) return Response.json({ ok: false }, { status: 403 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = String(form?.get("kind") ?? "");
  if (!(file instanceof File) || !["intake", "cv"].includes(kind)) return Response.json({ ok: false, error: "طلب غير صحيح" }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return Response.json({ ok: false, error: "الحجم الأقصى 4 ميجابايت" }, { status: 413 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const v = validateFile(file.name, file.type, bytes);
  if (!v.ok) return Response.json({ ok: false, error: v.error }, { status: 400 });
  await ensureDb();
  // Abandoned uploads (never attached to a request) are removed after a day.
  await db.execute(sql`DELETE FROM uploads WHERE claimed = false AND created_at < now() - interval '1 day'`);
  // Global cap on files waiting to be attached (abuse and storage guard).
  const held = await db.execute(sql`SELECT COALESCE(sum(size), 0)::bigint AS total FROM uploads WHERE claimed = false`);
  if (Number((held.rows as { total: string }[])[0]?.total ?? 0) + bytes.length > 100 * 1024 * 1024) return Response.json({ ok: false, error: "التخزين المؤقت ممتلئ، حاول لاحقًا" }, { status: 503 });
  const id = crypto.randomUUID();
  await db.execute(sql`INSERT INTO uploads (id, kind, filename, mime, size, data) VALUES (${id}, ${kind}, ${safeName(file.name)}, ${v.mime}, ${bytes.length}, ${Buffer.from(bytes)})`);
  return Response.json({ ok: true, id, name: safeName(file.name) });
}
