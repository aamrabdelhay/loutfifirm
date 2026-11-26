import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { hashAccessCode } from "@/features/training/server";
import { trainingGroups, trainingSessions, trainingAssignments } from "@/features/training/schema";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Trainees open their group's schedule with the group's access code. The code is a
 * shared secret, so this exposes only the schedule and assignments, never attendance
 * or any personal data.
 */
export async function POST(req: Request) {
  if (!rateLimit(`portal:${clientKey(req)}`, 10, 15 * 60_000)) return Response.json({ ok: false, error: "محاولات كثيرة" }, { status: 429 });
  const body = (await req.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (code.length < 16) return Response.json({ ok: false, error: "كود غير صحيح" }, { status: 401 });
  await ensureDb();
  const groups = await db.select().from(trainingGroups).where(eq(trainingGroups.accessCode, hashAccessCode(code))).limit(1);
  const g = groups[0];
  if (!g || !g.active) return Response.json({ ok: false, error: "كود غير صحيح" }, { status: 401 });
  const [sessions, assignments] = await Promise.all([
    db.select().from(trainingSessions).where(eq(trainingSessions.groupId, g.id)),
    db.select().from(trainingAssignments).where(eq(trainingAssignments.groupId, g.id)),
  ]);
  return Response.json({
    ok: true,
    group: { name: g.name },
    sessions: sessions.sort((a, b) => a.date.localeCompare(b.date)).map(({ title, date, time, place, notes }) => ({ title, date, time, place, notes })),
    assignments: assignments.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(({ title, description, dueDate }) => ({ title, description, dueDate })),
  });
}
