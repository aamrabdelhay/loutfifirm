import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isEmptyTable } from "@/features/seo/thin";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { glossary } from "@/features/guides/schema";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  return { title: "المصطلحات القانونية", robots: (await isEmptyTable("glossary")) ? { index: false, follow: true } : undefined };
}

export default async function GlossaryPage() {
  await ensureDb();
  const list = await db.select().from(glossary).orderBy(asc(glossary.term));
  return (
    <SiteShell>
      <PageHero label="المعرفة" title="المصطلحات القانونية" crumb="المصطلحات" description="تعريفات مختصرة لمصطلحات قانونية شائعة." />
      <section className="py-16"><div className="container-x max-w-3xl">
        {list.length === 0 ? <p className="text-muted">سيتم إضافة المصطلحات قريبًا.</p> : null}
        <dl className="space-y-5">{list.map((t) => <div key={t.id}><dt className="font-bold text-ink-900">{t.term}</dt><dd className="leading-8 text-muted">{t.definition}</dd></div>)}</dl>
      </div></section>
    </SiteShell>
  );
}
