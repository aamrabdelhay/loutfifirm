import type { Metadata } from "next";
import Link from "next/link";
import { Search, FileText } from "lucide-react";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { listStudies } from "@/features/studies/queries";
import { STUDY_KINDS } from "@/features/studies/schema";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "مركز القضايا والدراسات القانونية — أ.د/ حسام لطفي" };

export default async function StudiesPage({ searchParams }: { searchParams: Promise<{ q?: string; kind?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const all = await listStudies();
  const items = all.filter((s) => (!sp.kind || s.kind === sp.kind) && (!q || [s.title, s.summary, s.content].some((v) => v.toLowerCase().includes(q))));
  const link = (kind: string) => `/studies${kind ? `?kind=${kind}` : ""}`;
  return (
    <SiteShell>
      <PageHero label="الدراسات" title="مركز القضايا والدراسات القانونية" crumb="الدراسات" description="دراسات وأبحاث وتحليلات قانونية ينشرها المكتب." />
      <section className="py-16 md:py-24"><div className="container-x">
        <form action="/studies" method="get" role="search" className="mb-6 flex max-w-xl gap-2">
          <input name="q" defaultValue={sp.q ?? ""} className="input" placeholder="ابحث في الدراسات" aria-label="بحث" />
          {sp.kind ? <input type="hidden" name="kind" value={sp.kind} /> : null}
          <button className="btn btn-ink !px-5" type="submit"><Search size={16} />بحث</button>
        </form>
        <div className="mb-8 flex flex-wrap gap-2 text-sm">
          <Link href={link("")} className={`badge ${!sp.kind ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>الكل</Link>
          {Object.entries(STUDY_KINDS).map(([k, v]) => <Link key={k} href={link(k)} className={`badge ${sp.kind === k ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>{v}</Link>)}
        </div>
        {items.length === 0 ? <p className="py-16 text-center text-muted">{all.length === 0 ? "لم تُنشر دراسات بعد." : "لا توجد نتائج مطابقة."}</p> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((s, i) => (
              <Reveal key={s.id} delay={Math.min(i * 60, 300)}>
                <Link href={`/studies/${s.id}`} className="card-elegant block h-full p-6">
                  <span className="badge border border-sand"><FileText size={12} />{STUDY_KINDS[s.kind] ?? s.kind}{s.year ? ` · ${s.year}` : ""}</span>
                  <span className="font-display mt-3 block text-xl font-bold leading-relaxed text-ink-900">{s.title}</span>
                  <span className="mt-2 block text-sm leading-8 text-muted line-clamp-3">{s.summary}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div></section>
    </SiteShell>
  );
}
