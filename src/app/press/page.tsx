import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isEmptyTable } from "@/features/seo/thin";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { pressReleases } from "@/features/press/schema";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  return { title: "البيانات الصحفية", robots: (await isEmptyTable("press_releases")) ? { index: false, follow: true } : undefined };
}

export default async function PressPage() {
  await ensureDb();
  const list = await db.select().from(pressReleases).where(eq(pressReleases.published, true)).orderBy(desc(pressReleases.date));
  return (
    <SiteShell>
      <PageHero label="الإعلام" title="البيانات الصحفية" crumb="البيانات الصحفية" description="بيانات المكتب المنشورة للصحافة." />
      <section className="py-16"><div className="container-x max-w-4xl space-y-5">
        {list.length === 0 ? <p className="text-muted">لا توجد بيانات منشورة حاليًا.</p> : null}
        {list.map((p) => (
          <article key={p.id} id={`p${p.id}`} className="card-elegant p-6">
            <div className="text-xs text-muted" dir="ltr">{p.date}</div>
            <h2 className="font-display text-xl font-bold text-ink-900">{p.title}</h2>
            {p.summary ? <p className="mt-1 text-muted">{p.summary}</p> : null}
            {p.body ? <div className="mt-3 space-y-3 leading-8">{p.body.split(/\n\s*\n/).map((x, i) => <p key={i}>{x}</p>)}</div> : null}
            {/^https?:\/\//.test(p.pdfLink) ? <a className="mt-3 inline-block font-bold underline" href={p.pdfLink} target="_blank" rel="noopener noreferrer">تحميل PDF</a> : null}
          </article>
        ))}
      </div></section>
    </SiteShell>
  );
}
