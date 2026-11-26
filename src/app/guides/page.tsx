import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isEmptyTable } from "@/features/seo/thin";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { guides } from "@/features/guides/schema";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  return { title: "أدلة الحقوق", robots: (await isEmptyTable("guides")) ? { index: false, follow: true } : undefined };
}

export default async function GuidesPage() {
  await ensureDb();
  const list = await db.select().from(guides).where(eq(guides.published, true));
  return (
    <SiteShell>
      <PageHero label="المعرفة" title="أدلة الحقوق" crumb="أدلة الحقوق" description="شروحات مبسطة. هي معلومات عامة وليست استشارة قانونية لحالتك." />
      <section className="py-16"><div className="container-x max-w-4xl space-y-4">
        {list.length === 0 ? <p className="text-muted">سيتم نشر الأدلة قريبًا.</p> : null}
        {list.map((g) => (
          <Link key={g.id} href={`/guides/${g.id}`} className="card-elegant block p-6">
            {g.category ? <div className="text-xs font-bold text-muted">{g.category}</div> : null}
            <h2 className="font-display text-xl font-bold text-ink-900">{g.title}</h2>
            {g.summary ? <p className="mt-1 leading-8 text-muted">{g.summary}</p> : null}
          </Link>
        ))}
        <Link href="/glossary" className="inline-block font-bold underline">المصطلحات القانونية</Link>
      </div></section>
    </SiteShell>
  );
}
