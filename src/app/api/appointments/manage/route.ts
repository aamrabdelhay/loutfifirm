import { z } from "zod";
import { officeFetch } from "@/features/booking/upstream";
import { verifyManageToken } from "@/features/booking/token";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const base = z.object({ id: z.string().uuid(), t: z.string().min(10).max(120) });

/** Status of one request. Returns only what the office system reports for that submission. */
export async function GET(req: Request) {
  if (!rateLimit(`manage:${clientKey(req)}`, 30, 10 * 60_000)) return Response.json({ ok: false }, { status: 429 });
  const url = new URL(req.url);
  const p = base.safeParse({ id: url.searchParams.get("id"), t: url.searchParams.get("t") });
  if (!p.success || !verifyManageToken(p.data.id, p.data.t)) return Response.json({ ok: false, error: "invalid" }, { status: 403 });
  try {
    const res = await officeFetch(`/api/public/appointments/manage?id=${p.data.id}`, { method: "GET" });
    const d = await res.json().catch(() => ({}));
    if (!res.ok || !d.ok) return Response.json({ ok: false, error: "unavailable" }, { status: res.status === 404 ? 404 : 502 });
    return Response.json({ ok: true, appointment: d.appointment });
  } catch {
    return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
  }
}

const action = base.extend({
  action: z.enum(["cancel", "reschedule"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  note: z.string().trim().max(500).optional(),
});

/** Cancel, or ask to move, one request. The office system enforces the rules. */
export async function POST(req: Request) {
  if (!rateLimit(`manage-post:${clientKey(req)}`, 8, 10 * 60_000)) return Response.json({ ok: false }, { status: 429 });
  const p = action.safeParse(await req.json().catch(() => null));
  if (!p.success || !verifyManageToken(p.data.id, p.data.t)) return Response.json({ ok: false, error: "invalid" }, { status: 403 });
  try {
    const { t: _t, ...payload } = p.data; void _t;
    const res = await officeFetch(`/api/public/appointments/manage`, { method: "POST", body: JSON.stringify(payload) });
    const d = await res.json().catch(() => ({}));
    if (!res.ok || !d.ok) return Response.json({ ok: false, error: d.error || "تعذر تنفيذ الطلب" }, { status: res.status >= 500 ? 502 : res.status });
    return Response.json({ ok: true, appointment: d.appointment });
  } catch {
    return Response.json({ ok: false, error: "تعذر الاتصال بنظام المكتب" }, { status: 502 });
  }
}
