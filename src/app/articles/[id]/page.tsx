import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Tag } from "lucide-react";
import { SiteShell } from "@/components/shell";
import { Reveal } from "@/components/ui";
import { getArticleById, listArticles } from "@/lib/content";
import { formatArDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(Number(id));
  if (!article || !article.published) notFound();

  const others = (await listArticles()).filter((a) => a.id !== article.id).slice(0, 3);
  const paragraphs = article.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="ink-surface relative overflow-hidden pt-36 pb-16 md:pt-44">
        <div className="container-x">
          <Reveal className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#b9c4da]">
              {article.category ? (
                <span className="badge bg-steel-500/15 text-steel-300 border border-steel-500/30">
                  <Tag size={12} />
                  {article.category}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} className="text-steel-500" />
                {formatArDate(article.createdAt)}
              </span>
            </div>
            <h1 className="font-display mt-5 text-3xl md:text-[2.7rem] font-bold leading-[1.5] text-steel-100">
              {article.title}
            </h1>
            {article.excerpt ? (
              <p className="mt-5 text-base md:text-lg leading-9 text-[#c6cfdf]">{article.excerpt}</p>
            ) : null}
          </Reveal>
        </div>
        <div className="absolute -bottom-px inset-x-0 h-px bg-gradient-to-l from-transparent via-steel-500/50 to-transparent" />
      </section>

      {/* Body */}
      <section className="py-14 md:py-20">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            <Reveal as="article" className="max-w-3xl">
              {article.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image}
                  alt={article.title}
                  className="mb-8 w-full rounded-2xl border border-sand object-cover shadow-lg"
                />
              ) : null}
              <div className="space-y-6">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-base md:text-[1.06rem] leading-[2.2] text-[#33415e]">
                    {p}
                  </p>
                ))}
              </div>
              <div className="divider-ornament mt-10">
                <span className="font-display text-sm">— أ.د/ محمد حسام محمود لطفي —</span>
              </div>
              <Link href="/articles" className="btn btn-outline-ink mt-10">
                <ArrowRight size={16} className="rotate-180" />
                العودة للمقالات
              </Link>
            </Reveal>

            {/* Sidebar */}
            {others.length > 0 ? (
              <aside className="space-y-5 lg:sticky lg:top-28 self-start">
                <h3 className="font-display text-xl font-bold text-ink-900">مقالات أخرى</h3>
                {others.map((a) => (
                  <Link key={a.id} href={`/articles/${a.id}`} className="group card-elegant block p-5">
                    <span className="text-xs text-steel-600">{a.category || formatArDate(a.createdAt)}</span>
                    <span className="mt-1.5 block font-bold leading-7 text-ink-900 transition-colors group-hover:text-steel-600">
                      {a.title}
                    </span>
                  </Link>
                ))}
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
