import Link from "next/link";
import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { listArticles } from "@/lib/content";
import { formatArDate } from "@/lib/utils";
import { Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const [content, articles] = await Promise.all([getContent(), listArticles()]);

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
          {articles.length === 0 ? (
            <Reveal className="py-20 text-center text-muted">
              <Newspaper className="mx-auto mb-4 text-steel-500" size={40} />
              لا توجد مقالات منشورة حاليًا — تابعونا قريبًا.
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
