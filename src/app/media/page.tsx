import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { YoutubeCard } from "@/components/youtube-card";
import { listMedia } from "@/lib/content";
import { Video } from "lucide-react";
import Link from "next/link";
import { MEDIA_KINDS } from "@/features/media/kinds";
import { snippet } from "@/features/media/transcript";

export const dynamic = "force-dynamic";

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ kind?: string; year?: string; q?: string }> }) {
  const sp = await searchParams;
  const [content, all] = await Promise.all([getContent(), listMedia()]);
  const years = Array.from(new Set(all.map((m) => m.dateLabel).filter(Boolean))).sort().reverse();
  const q = (sp.q ?? "").trim();
  const media = all.filter((m) =>
    (!sp.kind || m.kind === sp.kind) && (!sp.year || m.dateLabel === sp.year) &&
    (!q || [m.title, m.description, m.event, m.transcript].some((v) => v.toLowerCase().includes(q.toLowerCase())))
  );
  const link = (kind: string, year: string) => {
    const p = new URLSearchParams();
    if (kind) p.set("kind", kind);
    if (year) p.set("year", year);
    return p.toString() ? `/media?${p}` : "/media";
  };

  return (
    <SiteShell>
      <PageHero
        label="وسائط ومحاضرات"
        title="شاهد الدكتور على الشاشات"
        crumb="وسائط ومحاضرات"
        description={content.pages.media}
      />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <form action="/media" method="get" role="search" className="mb-6 flex max-w-xl gap-2">
            <input name="q" defaultValue={q} className="input" placeholder="ابحث في العناوين والنصوص المكتوبة" aria-label="بحث في الوسائط" />
            {sp.kind ? <input type="hidden" name="kind" value={sp.kind} /> : null}
            {sp.year ? <input type="hidden" name="year" value={sp.year} /> : null}
            <button className="btn btn-ink !px-5" type="submit">بحث</button>
          </form>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold text-ink-800">النوع:</span>
            <Link href={link("", sp.year ?? "")} className={`badge ${!sp.kind ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>الكل</Link>
            {Object.entries(MEDIA_KINDS).map(([k, v]) => <Link key={k} href={link(k, sp.year ?? "")} className={`badge ${sp.kind === k ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>{v}</Link>)}
          </div>
          {years.length > 1 ? (
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-ink-800">السنة:</span>
              <Link href={link(sp.kind ?? "", "")} className={`badge ${!sp.year ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>الكل</Link>
              {years.map((y) => <Link key={y} href={link(sp.kind ?? "", y)} className={`badge ${sp.year === y ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>{y}</Link>)}
            </div>
          ) : null}
          {media.length === 0 ? (
            <Reveal className="py-20 text-center text-muted">
              <Video className="mx-auto mb-4 text-steel-500" size={40} />
              {all.length === 0 ? "لا توجد وسائط منشورة حاليًا." : "لا توجد وسائط مطابقة."}
            </Reveal>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {media.map((m, i) => (
                <Reveal key={m.id} delay={Math.min(i * 80, 320)}>
                  <YoutubeCard url={m.url} title={m.title} source={m.source} dateLabel={m.dateLabel} large />
                  {m.event || m.location ? <p className="mt-3 text-xs font-bold text-steel-700">{[m.event, m.location].filter(Boolean).join(" · ")}</p> : null}
                  {q && m.transcript && snippet(m.transcript, q) ? <p className="mt-3 rounded-lg border border-sand bg-white/60 p-3 text-sm leading-7 text-ink-800">{snippet(m.transcript, q)}</p> : null}
                  {m.transcript ? <Link href={`/media/${m.id}`} className="mt-2 inline-block text-sm font-bold text-steel-700 underline">قراءة النص المكتوب</Link> : null}
                  {m.description ? (
                    <p className="mt-4 text-sm leading-8 text-muted">{m.description}</p>
                  ) : null}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
