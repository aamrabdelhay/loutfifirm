import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Play,
  Newspaper,
  BookOpen,
  Scale,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal, SectionHeading, Icon } from "@/components/ui";
import { YoutubeCard } from "@/components/youtube-card";
import { BookCover } from "@/components/book-cover";
import {
  getContent,
  listServices,
  listArticles,
  listMedia,
  listBooks,
} from "@/lib/content";
import { formatArDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, services, articles, media, books] = await Promise.all([
    getContent(),
    listServices(),
    listArticles(),
    listMedia(),
    listBooks(),
  ]);
  const { hero, stats, why, specialties, cta, general } = content;
  const featuredBooks = books.filter((b) => b.featured).slice(0, 4);

  return (
    <>
      <SiteHeader
        siteName={general.siteName}
        siteNameEn={general.siteNameEn}
        tagline={general.tagline}
        headerCta={general.headerCta}
      />

      <main>
        {/* ============================ HERO ============================ */}
        <section className="ink-surface relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-28">
          {/* ornaments */}
          <Scale
            className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 text-steel-500/[0.05]"
            size={560}
            strokeWidth={0.5}
          />
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-steel-500/60 to-transparent" />

          <div className="container-x relative">
            <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Text */}
              <div>
                <Reveal>
                  <span className="inline-flex items-center gap-2 rounded-full border border-steel-500/35 bg-steel-500/10 px-4 py-1.5 text-[13px] font-bold text-steel-300">
                    <Sparkles size={14} />
                    {hero.badge}
                  </span>
                </Reveal>
                <Reveal delay={100}>
                  <p className="font-display mt-7 text-xl md:text-2xl text-steel-300/90">{hero.prefix}</p>
                  <h1 className="font-display mt-1 text-[2.6rem] leading-[1.25] font-bold md:text-[4.2rem] md:leading-[1.2]">
                    <span className="text-steel-100">أ.د/ محمد حسام</span>
                    <br />
                    <span className="steel-text">محمود لطفي</span>
                  </h1>
                </Reveal>
                <Reveal delay={200}>
                  <ul className="mt-6 space-y-2.5">
                    {hero.titles.map((t) => (
                      <li key={t} className="flex items-start gap-3 text-[#d5dcee] text-[15px] md:text-base">
                        <span className="mt-2 size-2 rotate-45 shrink-0 bg-steel-500" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={300}>
                  <p className="mt-6 max-w-xl text-[15px] md:text-base leading-8 text-[#a9b6cd]">
                    {hero.description}
                  </p>
                </Reveal>
                <Reveal delay={400}>
                  <div className="mt-9 flex flex-wrap gap-4">
                    <Link href="/contact" className="btn btn-ivory">
                      {hero.ctaPrimary}
                      <ArrowLeft size={17} />
                    </Link>
                    <Link href="/academia" className="btn btn-outline-light">
                      <BookOpen size={17} />
                      {hero.ctaSecondary}
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* Portrait */}
              <Reveal delay={250} className="relative mx-auto w-full max-w-sm">
                <div className="absolute -inset-5 rounded-[1.6rem] border border-steel-500/25" />
                <div className="absolute -inset-10 rounded-[2rem] border border-steel-500/10" />
                <div className="relative overflow-hidden rounded-[1.4rem] border-2 border-steel-400/50 shadow-[0_35px_70px_-25px_rgba(0,0,0,0.8)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.image} alt={hero.name} className="w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                  <p className="absolute bottom-4 inset-x-0 text-center text-sm text-steel-200/90">
                    {hero.imageCaption}
                  </p>
                </div>
                {/* floating badge */}
                <div className="animate-floaty absolute -bottom-6 -start-8 rounded-2xl border border-steel-500/40 bg-ink-900/95 px-5 py-3.5 shadow-2xl backdrop-blur">
                  <span className="steel-text font-display text-3xl font-bold">+40</span>
                  <span className="block text-xs text-[#b9c4da]">عامًا من العطاء القانوني</span>
                </div>
              </Reveal>
            </div>

            <div className="mt-16 flex justify-center">
              <ChevronDown className="animate-bounce text-steel-500/70" size={26} />
            </div>
          </div>
        </section>

        {/* ============================ STATS ============================ */}
        <section className="relative z-10 -mt-1 pb-4">
          <div className="container-x">
            <Reveal>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-sand bg-sand shadow-[0_25px_60px_-30px_rgba(11,29,51,0.35)] md:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="bg-cream px-6 py-8 text-center">
                    <span className="steel-text font-display text-4xl md:text-5xl font-bold" dir="ltr">
                      {s.value}
                    </span>
                    <span className="mt-1.5 block text-sm font-medium text-muted">{s.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================ MARQUEE ============================ */}
        <section className="py-10" aria-hidden>
          <div className="border-y border-steel-500/30 bg-gradient-to-l from-steel-500/12 via-steel-400/8 to-steel-500/12 py-4 overflow-hidden">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center">
                  {[...specialties, ...specialties].map((s, i) => (
                    <span key={`${copy}-${i}`} className="flex items-center gap-6 pe-6 text-ink-800 font-bold text-sm md:text-base">
                      {s}
                      <span className="size-1.5 rotate-45 bg-steel-600" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ WHY ============================ */}
        <section className="py-16 md:py-24">
          <div className="container-x">
            <SectionHeading label={why.label} title={why.title} intro={why.paragraph} />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {why.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 80}>
                  <div className="card-elegant h-full p-7">
                    <span className="grid size-13 place-items-center rounded-xl border border-steel-500/35 bg-gradient-to-br from-steel-500/18 to-transparent text-steel-600">
                      <Icon name={f.icon} size={24} />
                    </span>
                    <h3 className="font-display mt-5 text-xl font-bold text-ink-900">{f.title}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-muted">{f.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ SERVICES ============================ */}
        <section className="bg-sand/45 py-16 md:py-24">
          <div className="container-x">
            <SectionHeading
              label="مجالات التخصص"
              title="خدمات قانونية بمعايير دولية"
              intro="لا نقدم استشارات عامة — بل حلولًا قانونية دقيقة مبنية على خبرة أكاديمية راسخة وممارسة قضائية فعلية."
            />
            <div className="mt-14 space-y-4">
              {services.map((s, i) => (
                <Reveal key={s.id} delay={i * 60}>
                  <Link
                    href="/services"
                    className="group card-elegant flex flex-col gap-4 p-6 md:flex-row md:items-center md:gap-8 md:p-7"
                  >
                    <span className="font-latin text-4xl font-semibold text-steel-500/50 transition-colors group-hover:text-steel-500 md:w-20 md:text-center" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-ink-900 text-steel-300">
                      <Icon name={s.icon} size={25} />
                    </span>
                    <span className="flex-1">
                      <span className="font-display block text-xl font-bold text-ink-900 md:text-2xl">{s.title}</span>
                      <span className="mt-1 block text-sm leading-7 text-muted">{s.summary}</span>
                    </span>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-steel-500/40 text-steel-600 transition-all duration-300 group-hover:bg-steel-500 group-hover:text-ink-950">
                      <ArrowLeft size={18} />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============================ BOOKS ============================ */}
        {featuredBooks.length > 0 ? (
          <section className="relative overflow-hidden py-16 md:py-24">
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{ backgroundImage: "url(/img/library.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/85 to-ivory" />
            <div className="container-x relative">
              <SectionHeading
                label="مرجعات موثوقة"
                title="من مكتبة الدكتور"
                intro="ترشيحات من أبرز المراجع القانونية المعتمدة في الجامعات العربية."
              />
              <div className="mt-14 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
                {featuredBooks.map((b, i) => (
                  <Reveal key={b.id} delay={i * 90}>
                    <BookCover title={b.title} category={b.category} year={b.year} note={b.note} />
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-12 text-center">
                <Link href="/academia" className="btn btn-outline-ink">
                  المكتبة الكاملة
                  <ArrowLeft size={17} />
                </Link>
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* ============================ MEDIA ============================ */}
        <section className="ink-surface py-16 md:py-24">
          <div className="container-x">
            <SectionHeading
              dark
              label="حضور إعلامي"
              title="محاضرات ومداخلات مسجلة"
              intro="مختارات من ظهور الدكتور في البرامج التلفزيونية والفعاليات الثقافية."
            />
            <div className="mt-14 grid gap-7 md:grid-cols-2">
              {media.slice(0, 2).map((m, i) => (
                <Reveal key={m.id} delay={i * 100}>
                  <YoutubeCard url={m.url} title={m.title} source={m.source} dateLabel={m.dateLabel} large />
                  {m.description ? (
                    <p className="mt-4 text-sm leading-7 text-[#a9b6cd]">{m.description}</p>
                  ) : null}
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-12 text-center">
              <Link href="/media" className="btn btn-outline-light">
                <Play size={17} />
                جميع الوسائط
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============================ ARTICLES ============================ */}
        <section className="py-16 md:py-24">
          <div className="container-x">
            <SectionHeading
              label="رأي قانوني"
              title="آخر المقالات والأخبار"
              intro="مقالات وآراء الدكتور في أبرز القضايا القانونية المعاصرة."
            />
            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {articles.slice(0, 3).map((a, i) => (
                <Reveal key={a.id} delay={i * 90}>
                  <Link href={`/articles/${a.id}`} className="group card-elegant block h-full overflow-hidden">
                    {a.image ? (
                      <span className="relative block aspect-[16/9.5] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.image}
                          alt={a.title}
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-ink-950/45 to-transparent" />
                        {a.category ? (
                          <span className="badge absolute top-3 start-3 bg-ink-950/80 text-steel-300 backdrop-blur">
                            {a.category}
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                    <span className="block p-6">
                      <span className="text-xs text-steel-600">{formatArDate(a.createdAt)}</span>
                      <span className="font-display mt-2 block text-lg font-bold leading-relaxed text-ink-900 line-clamp-2 transition-colors group-hover:text-steel-600">
                        {a.title}
                      </span>
                      <span className="mt-2.5 block text-sm leading-7 text-muted line-clamp-3">{a.excerpt}</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-12 text-center">
              <Link href="/articles" className="btn btn-outline-ink">
                <Newspaper size={17} />
                جميع المقالات
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============================ CTA ============================ */}
        <section className="pb-20 md:pb-28">
          <div className="container-x">
            <Reveal>
              <div className="ink-surface relative overflow-hidden rounded-[1.8rem] px-8 py-14 text-center md:px-16 md:py-20">
                <Scale
                  className="pointer-events-none absolute -right-14 -top-14 text-steel-500/10"
                  size={280}
                  strokeWidth={0.7}
                />
                <span className="section-label on-dark justify-center">استشارتك تبدأ من هنا</span>
                <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold leading-[1.4] text-steel-100 md:text-5xl md:leading-[1.35]">
                  {cta.title}
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-[#c6cfdf] leading-8">{cta.text}</p>
                <Link href="/contact" className="btn btn-ivory mt-9">
                  {cta.button}
                  <ArrowLeft size={17} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter content={content} />
    </>
  );
}
