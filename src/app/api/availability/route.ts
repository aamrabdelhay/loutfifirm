import { BRANCH_IDS } from "@/features/booking/config";
import { officeFetch } from "@/features/booking/upstream";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Real availability comes only from the office system. If that system has no
 * availability endpoint yet (or is unreachable) we answer available:false and the
 * form falls back to a plain request. We never invent time slots.
 */
export async function GET(req: Request) {
  if (!rateLimit(`avail:${clientKey(req)}`, 60, 5 * 60_000)) {
    return Response.json({ ok: false, error: "rate" }, { status: 429 });
  }
  const url = new URL(req.url);
  const date = url.searchParams.get("date") ?? "";
  const branch = url.searchParams.get("branch") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !(BRANCH_IDS as readonly string[]).includes(branch)) {
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }
  try {
    const res = await officeFetch(`/api/public/availability?date=${date}&branch=${branch}`, { method: "GET" });
    if (!res.ok) return Response.json({ ok: true, available: false, slots: [] });
    const data = await res.json();
    const slots = Array.isArray(data?.slots) ? data.slots.filter((s: unknown) => typeof s === "string" && /^\d{2}:\d{2}$/.test(s)) : [];
    return Response.json({ ok: true, available: data?.ok === true, slots });
  } catch {
    return Response.json({ ok: true, available: false, slots: [] });
  }
}
