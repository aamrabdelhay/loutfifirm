import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { guides } from "@/features/guides/schema";

export const dynamic = "force-dynamic";

async function load(id: string) {
  const n = Number(id);
  if (!Number.isInteger(n)) return null;
  await ensureDb();
  const g = (await db.select().from(guides).where(eq(guides.id, n)).limit(1))[0];
  return g && g.published ? g : null;
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const g = await load((await params).id);
  return { title: g?.title ?? "دليل", description: g?.summary || undefined };
}
export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const g = await load((await params).id);
  if (!g) notFound();
  return (
    <SiteShell>
      <PageHero label={g.category || "أدلة الحقوق"} title={g.title} crumb="دليل" description={g.summary} />
      <section className="py-16"><div className="container-x max-w-3xl space-y-5 leading-9">
        {g.body.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
        <p className="rounded-xl bg-ink-50 p-4 text-sm text-muted">هذا المحتوى معلومات عامة وليس استشارة قانونية. للحصول على رأي في حالتك تواصل مع المكتب.</p>
      </div></section>
    </SiteShell>
  );
}
