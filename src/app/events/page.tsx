import type { Metadata } from "next";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isEmptyTable } from "@/features/seo/thin";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { events } from "@/features/events/schema";
import { RegisterForm } from "@/features/events/register-form";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  return { title: "الفعاليات والندوات", robots: (await isEmptyTable("events")) ? { index: false, follow: true } : undefined };
}

export default async function EventsPage() {
  await ensureDb();
  const list = await db.select().from(events).where(eq(events.published, true));
  const counts = await db.execute(sql`SELECT event_id, count(*)::int AS n FROM event_registrations GROUP BY event_id`);
  const taken = new Map((counts.rows as { event_id: number; n: number }[]).map((r) => [r.event_id, r.n]));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = list.filter((e) => !e.date || e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = list.filter((e) => e.date && e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <SiteShell>
      <PageHero label="الفعاليات" title="الفعاليات والندوات" crumb="الفعاليات" description="ندوات وفعاليات المكتب. سجل مقعدك من هنا." />
      <section className="py-16"><div className="container-x max-w-4xl space-y-6">
        {upcoming.length === 0 ? <p className="text-muted">لا توجد فعاليات قادمة حاليًا.</p> : null}
        {upcoming.map((e) => (
          <article key={e.id} className="card-elegant p-6">
            <div className="text-xs font-bold text-muted">{e.kind === "webinar" ? "ندوة أونلاين" : "فعالية"}</div>
            <h2 className="font-display text-xl font-bold text-ink-900">{e.title}</h2>
            <div className="text-sm text-muted" dir="ltr">{e.date} {e.time}</div>
            {e.place ? <div className="text-sm">{e.place}</div> : null}
            {e.description ? <p className="mt-2 leading-8">{e.description}</p> : null}
            {e.capacity > 0 ? <div className="mt-1 text-sm text-muted">المقاعد المتبقية: {Math.max(0, e.capacity - (taken.get(e.id) ?? 0))}</div> : null}
            <RegisterForm eventId={e.id} full={e.capacity > 0 && (taken.get(e.id) ?? 0) >= e.capacity} />
          </article>
        ))}
        {past.length ? <div><h2 className="mb-3 font-bold">فعاليات سابقة</h2><ul className="space-y-2 text-sm">{past.map((e) => <li key={e.id}>{e.title} <span className="text-muted" dir="ltr">({e.date})</span></li>)}</ul></div> : null}
      </div></section>
    </SiteShell>
  );
}
