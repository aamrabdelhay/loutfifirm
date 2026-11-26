import { z } from "zod";
import { sql } from "drizzle-orm";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { applications } from "@/db/schema";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { YEAR_OPTIONS } from "@/lib/nav";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2).max(300),
  university: z.string().trim().min(2).max(300),
  year: z.string().refine((v) => (YEAR_OPTIONS as readonly string[]).includes(v)),
  phone: z.string().trim().min(6).max(40).regex(/^[0-9+()\-\s]+$/),
  email: z.string().trim().email().max(180),
  linkedin: z.string().trim().max(300).optional().or(z.literal("")),
  cvLink: z.string().trim().max(500).optional().or(z.literal("")).refine((v) => !v || /^https?:\/\//i.test(v)),
  experiences: z.array(z.string().trim().max(500)).max(15).default([]),
  reason: z.string().trim().min(10).max(3000),
  source: z.string().max(200).optional(),
  cvUploadId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  if (!rateLimit(`apply:${clientKey(req)}`, 4, 15 * 60_000)) {
    return Response.json({ ok: false, error: "محاولات كثيرة، حاول لاحقًا" }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, error: "برجاء مراجعة البيانات المدخلة" }, { status: 400 });
  }
  const d = parsed.data;
  try {
    await ensureDb();
    // Same email applying again within 7 days: keep the first application, answer success.
    const since = new Date(Date.now() - 7 * 864e5);
    const dup = await db.select({ id: applications.id }).from(applications)
      .where(and(eq(applications.email, d.email), gt(applications.createdAt, since))).limit(1);
    if (dup.length === 0) {
      let cvUploadId = "";
      if (d.cvUploadId) {
        const c = await db.execute(sql`UPDATE uploads SET claimed = true WHERE id = ${d.cvUploadId}::uuid AND kind = 'cv' AND claimed = false RETURNING id`);
        cvUploadId = (c.rows[0] as { id: string } | undefined)?.id ?? "";
      }
      await db.insert(applications).values({
        name: d.name, university: d.university, year: d.year, phone: d.phone, email: d.email,
        linkedin: d.linkedin ?? "", cvLink: d.cvLink ?? "", cvUploadId, experiences: d.experiences.filter(Boolean), reason: d.reason, source: d.source ?? "",
      });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "حدث خطأ أثناء إرسال الطلب" }, { status: 500 });
  }
}
