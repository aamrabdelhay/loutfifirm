import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { events, eventRegistrations } from "@/features/events/schema";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
const schema = z.object({
  eventId: z.number().int().positive(),
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).regex(/^[0-9+()\-\s]*$/).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  if (!rateLimit(`evreg:${clientKey(req)}`, 6, 15 * 60_000)) return Response.json({ ok: false, error: "محاولات كثيرة" }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "برجاء مراجعة البيانات" }, { status: 400 });
  const d = parsed.data;
  await ensureDb();
  const ev = (await db.select().from(events).where(eq(events.id, d.eventId)).limit(1))[0];
  if (!ev || !ev.published) return Response.json({ ok: false, error: "الفعالية غير متاحة" }, { status: 404 });
  try {
    // One statement: insert only while seats remain. Capacity cannot be exceeded by concurrent requests
    // because the count and the insert share a single advisory-locked transaction.
    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(${ev.id})`);
      if (ev.capacity > 0) {
        const c = await tx.execute(sql`SELECT count(*)::int AS n FROM event_registrations WHERE event_id = ${ev.id}`);
        const n = (c.rows[0] as { n: number }).n;
        if (n >= ev.capacity) return "full" as const;
      }
      const ins = await tx.execute(sql`INSERT INTO event_registrations (event_id, name, email, phone) VALUES (${ev.id}, ${d.name}, ${d.email}, ${d.phone ?? ""}) ON CONFLICT DO NOTHING RETURNING id`);
      return ins.rows.length ? ("ok" as const) : ("dup" as const);
    });
    if (result === "full") return Response.json({ ok: false, error: "اكتمل العدد" }, { status: 409 });
    return Response.json({ ok: true, duplicate: result === "dup" });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "حدث خطأ" }, { status: 500 });
  }
}
