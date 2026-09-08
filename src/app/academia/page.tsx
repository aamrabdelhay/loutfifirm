import Link from "next/link";
import { BookOpen, FlaskConical, GraduationCap, ArrowLeft } from "lucide-react";
import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal, SectionHeading } from "@/components/ui";
import { BookCover } from "@/components/book-cover";
import { listBooks } from "@/lib/content";
import { BOOK_CATEGORIES } from "@/lib/default-content";

export const dynamic = "force-dynamic";

export default async function AcademiaPage() {
  const [content, books] = await Promise.all([getContent(), listBooks()]);
  const { academia } = content;
  const categories = Object.keys(BOOK_CATEGORIES);

  return (
    <SiteShell>
      <PageHero
        label="الأكاديمية والبحث العلمي"
        title="علمٌ راسخ وبحثٌ متجدد"
        crumb="الأكاديمية والبحث"
        description={academia.intro}
      />

      {/* Books */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{ backgroundImage: "url(/img/library.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/90 to-ivory" />
        <div className="container-x relative space-y-16">
          {categories.map((cat) => {
            const items = books.filter((b) => b.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <Reveal>
                  <h2 className="flex items-center gap-3 font-display text-2xl md:text-3xl font-bold text-ink-900">
                    <BookOpen className="text-steel-600" size={26} />
                    {BOOK_CATEGORIES[cat]}
                  </h2>
                  <div className="mt-3 h-px bg-gradient-to-l from-steel-500/50 via-steel-500/20 to-transparent" />
                </Reveal>
                <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-7 lg:grid-cols-4">
                  {items.map((b, i) => (
                    <Reveal key={b.id} delay={Math.min(i * 60, 300)}>
                      <BookCover title={b.title} category={b.category} year={b.year} note={b.note} />
                      {b.description ? (
                        <p className="mt-4 text-[13px] leading-7 text-muted line-clamp-3">{b.description}</p>
                      ) : null}
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Research */}
      <section className="ink-surface py-16 md:py-24">
        <div className="container-x">
          <SectionHeading dark label="الأبحاث والمقالات" title="أكثر من 100 بحث علمي منشور" intro={academia.researchIntro} />
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
            {academia.topics.map((t, i) => (
              <Reveal key={t} delay={Math.min(i * 40, 300)}>
                <span className="inline-flex items-center gap-2 rounded-full border border-steel-500/35 bg-white/[0.05] px-4 py-2 text-sm text-steel-100 transition-colors hover:bg-steel-500/15">
                  <FlaskConical size={14} className="text-steel-400" />
                  {t}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Supervision */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <Reveal>
            <div className="card-elegant mx-auto max-w-4xl p-8 md:p-12 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-full border border-steel-500/40 bg-gradient-to-br from-steel-500/18 to-transparent text-steel-600">
                <GraduationCap size={28} />
              </span>
              <h2 className="font-display mt-6 text-2xl md:text-3xl font-bold text-ink-900">الإشراف الأكاديمي على الرسائل العلمية</h2>
              <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-9 text-muted">{academia.supervision}</p>
              <p className="mt-6 text-sm font-bold text-steel-700">{academia.supervisionCta}</p>
              <Link href="/contact" className="btn btn-ink mt-6">
                تواصل معنا
                <ArrowLeft size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
