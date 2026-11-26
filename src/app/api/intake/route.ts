import { sameOriginOk } from "@/lib/same-origin";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { intakeRequests } from "@/features/intake/schema";
import { CASE_TYPE_VALUES, URGENCY_VALUES, CASE_TYPES } from "@/features/intake/config";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2).max(300),
  phone: z.string().trim().min(6).max(40).regex(/^[0-9+()\-\s]+$/),
  email: z.string().trim().email().max(180).optional().or(z.literal("")),
  contactMethod: z.enum(["phone", "whatsapp", "email"]).default("phone"),
  caseType: z.string().refine((v) => CASE_TYPE_VALUES.includes(v)),
  urgency: z.string().refine((v) => URGENCY_VALUES.includes(v)),
  deadlineDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  summary: z.string().trim().min(20).max(4000),
  documents: z.array(z.string().max(200)).max(20).default([]),
  consent: z.literal(true),
  source: z.string().max(200).optional(),
  attachmentIds: z.array(z.string().uuid()).max(5).default([]),
  website: z.string().max(0).optional(), // honeypot: real users leave it empty
});

class BadAttachments extends Error {}

export async function POST(req: Request) {
  if (!sameOriginOk(req)) return Response.json({ ok: false }, { status: 403 });
  if (!rateLimit(`intake:${clientKey(req)}`, 5, 10 * 60_000)) {
    return Response.json({ ok: false, error: "محاولات كثيرة، حاول لاحقًا" }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, error: "برجاء مراجعة البيانات المدخلة" }, { status: 400 });
  }
  const d = parsed.data;
  // Only accept document labels from the checklist of the chosen case type.
  const allowed = new Set(
    (CASE_TYPES.find((c) => c.value === d.caseType)?.docs ?? []).flatMap((x) => [x.ar, x.en, x.fr])
  );
  try {
    await ensureDb();
    // One transaction: files are claimed and the request saved together, or neither happens.
    const bad = await db.transaction(async (tx) => {
      let attachmentIds: string[] = [];
      if (d.attachmentIds.length) {
        const claimed = await tx.execute(sql`UPDATE uploads SET claimed = true WHERE kind = 'intake' AND claimed = false AND id IN (${sql.join(d.attachmentIds.map((x) => sql`${x}::uuid`), sql`, `)}) RETURNING id`);
        attachmentIds = (claimed.rows as { id: string }[]).map((r) => r.id);
        if (attachmentIds.length !== new Set(d.attachmentIds).size) {
          throw new BadAttachments();
        }
      }
      await tx.insert(intakeRequests).values({
        attachmentIds,
        name: d.name,
        phone: d.phone,
        email: d.email ?? "",
        contactMethod: d.contactMethod,
        caseType: d.caseType,
        urgency: d.urgency,
        deadlineDate: d.deadlineDate ?? "",
        summary: d.summary,
        source: d.source ?? "",
        documents: d.documents.filter((x) => allowed.has(x)),
      });
      return false;
    }).catch((e: unknown) => {
      if (e instanceof BadAttachments) return true;
      throw e;
    });
    if (bad) return Response.json({ ok: false, error: "أحد المرفقات غير صالح أو مستخدم من قبل، أعد رفعه" }, { status: 400 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("intake insert failed", err);
    return Response.json({ ok: false, error: "تعذر حفظ الطلب" }, { status: 500 });
  }
}
