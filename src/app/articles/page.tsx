import Link from "next/link";
import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { listArticles } from "@/lib/content";
import { formatArDate } from "@/lib/utils";
import { Newspaper, Search } from "lucide-react";
import { parseTags } from "@/features/articles/tags";

export const dynamic = "force-dynamic";

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; tag?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const [content, allArticles] = await Promise.all([getContent(), listArticles()]);
  const categories = Array.from(new Set(allArticles.map((a) => a.category).filter(Boolean)));
  const tags = Array.from(new Set(allArticles.flatMap((a) => parseTags(a.tags))));
  const articles = allArticles.filter((a) =>
    (!sp.category || a.category === sp.category) &&
    (!sp.tag || parseTags(a.tags).includes(sp.tag)) &&
    (!q || [a.title, a.excerpt, a.content, a.category, a.tags].some((v) => (v ?? "").toLowerCase().includes(q)))
  );
  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (sp.q) p.set("q", sp.q);
    if (sp.category) p.set("category", sp.category);
    if (sp.tag) p.set("tag", sp.tag);
    for (const [k, v] of Object.entries(extra)) { if (v) p.set(k, v); else p.delete(k); }
    const s = p.toString();
    return s ? `/articles?${s}` : "/articles";
  };

  return (
    <SiteShell>
      <PageHero
        label="المقالات والآراء القانونية"
        title="رأي الدكتور في القضايا الراهنة"
        crumb="المقالات"
        description={content.pages.articles}
      />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <form action="/articles" method="get" className="mb-6 flex max-w-xl gap-2" role="search">
            <input name="q" defaultValue={sp.q ?? ""} className="input" placeholder="ابحث في المقالات" aria-label="بحث في المقالات" />
            {sp.category ? <input type="hidden" name="category" value={sp.category} /> : null}
            {sp.tag ? <input type="hidden" name="tag" value={sp.tag} /> : null}
            <button className="btn btn-ink !px-5" type="submit"><Search size={16} />بحث</button>
          </form>
          {categories.length > 0 ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-ink-800">التصنيفات:</span>
              <Link href={qs({ category: "" })} className={`badge ${!sp.category ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>الكل</Link>
              {categories.map((c) => <Link key={c} href={qs({ category: c })} className={`badge ${sp.category === c ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>{c}</Link>)}
            </div>
          ) : null}
          {tags.length > 0 ? (
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-ink-800">الوسوم:</span>
              {tags.map((t) => <Link key={t} href={qs({ tag: sp.tag === t ? "" : t })} className={`badge ${sp.tag === t ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>#{t}</Link>)}
            </div>
          ) : null}
          {articles.length === 0 ? (
            <Reveal className="py-20 text-center text-muted">
              <Newspaper className="mx-auto mb-4 text-steel-500" size={40} />
              {allArticles.length === 0 ? "لا توجد مقالات منشورة حاليًا — تابعونا قريبًا." : "لا توجد مقالات مطابقة للبحث."}
            </Reveal>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, i) => (
                <Reveal key={a.id} delay={Math.min(i * 80, 320)}>
                  <Link href={`/articles/${a.id}`} className="group card-elegant flex h-full flex-col overflow-hidden">
                    {a.image ? (
                      <span className="relative block aspect-[16/9] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.image}
                          alt={a.title}
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
                        {a.category ? (
                          <span className="badge absolute top-3 start-3 bg-ink-950/80 text-steel-300 backdrop-blur">{a.category}</span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="ink-surface grid aspect-[16/9] place-items-center">
                        <Newspaper className="text-steel-500/50" size={44} />
                      </span>
                    )}
                    <span className="flex flex-1 flex-col p-6">
                      <span className="text-xs text-steel-600">{formatArDate(a.createdAt)}</span>
                      <span className="font-display mt-2 block text-xl font-bold leading-relaxed text-ink-900 transition-colors group-hover:text-steel-600">
                        {a.title}
                      </span>
                      <span className="mt-3 block flex-1 text-sm leading-8 text-muted line-clamp-3">{a.excerpt}</span>
                      <span className="mt-4 text-sm font-bold text-steel-600">اقرأ المقال كاملًا ←</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
