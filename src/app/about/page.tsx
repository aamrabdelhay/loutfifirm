import { GraduationCap, Scale, Globe, Check } from "lucide-react";
import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal, SectionHeading, Icon } from "@/components/ui";
import { listTimeline, listAwards, listBooks } from "@/lib/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [content, timeline, awards] = await Promise.all([
    getContent(),
    listTimeline(),
    listAwards(),
  ]);
  const { about, hero } = content;

  return (
    <SiteShell>
      <PageHero
        label="السيرة الذاتية"
        title="أ.د/ محمد حسام محمود لطفي"
        crumb="عن الدكتور"
        description="أستاذ القانون المدني — جامعة بني سويف | محامٍ بالنقض والمحكمة الدستورية العليا والإدارية العليا | خبير ومحكَّم دولي في الملكية الفكرية"
      />

      {/* Lead + bio */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div>
              <Reveal>
                <span className="section-label">من هو الدكتور؟</span>
                <p className="font-display mt-4 text-xl md:text-2xl font-bold leading-[1.9] text-ink-900">
                  {about.lead}
                </p>
              </Reveal>
              <div className="mt-8 space-y-6">
                {about.bio.map((p, i) => (
                  <Reveal key={i} delay={i * 70}>
                    <p className="text-[15px] md:text-base leading-9 text-[#3c4a66]">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={200} className="lg:sticky lg:top-28 self-start">
              <div className="card-elegant overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.image} alt={hero.name} className="w-full aspect-[4/4.6] object-cover" />
                <div className="p-5 text-center">
                  <p className="font-display font-bold text-ink-900">{hero.name}</p>
                  <p className="mt-1 text-xs text-muted leading-6">{hero.imageCaption}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="bg-sand/45 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            label="التعليم والتأهيل"
            title="المؤهلات العلمية"
            intro={about.educationIntro}
          />
          <div className="mx-auto mt-12 max-w-4xl">
            <Reveal>
              <div className="card-elegant overflow-hidden">
                <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="bg-ink-900 text-steel-200">
                      <th className="px-5 py-4 text-start font-bold w-24">السنة</th>
                      <th className="px-5 py-4 text-start font-bold">الدرجة العلمية</th>
                      <th className="px-5 py-4 text-start font-bold hidden md:table-cell">المؤسسة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {about.education.map((e, i) => (
                      <tr key={i} className="border-t border-sand transition-colors hover:bg-steel-500/5">
                        <td className="px-5 py-4 font-latin font-semibold text-steel-600" dir="ltr">{e.year}</td>
                        <td className="px-5 py-4 font-bold text-ink-900">{e.degree}</td>
                        <td className="px-5 py-4 text-muted hidden md:table-cell">{e.institution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="ink-surface mt-6 flex flex-col items-start gap-4 rounded-2xl p-7 md:flex-row md:items-center">
                <span className="grid size-13 shrink-0 place-items-center rounded-xl border border-steel-500/40 text-steel-300">
                  <GraduationCap size={24} />
                </span>
                <div>
                  <p className="text-xs font-bold text-steel-400">موضوع أطروحة الدكتوراه</p>
                  <p className="font-display mt-1 text-lg font-bold leading-relaxed text-steel-100">{about.thesis}</p>
                  <p className="font-latin mt-1 text-sm italic text-[#aebad0]" dir="ltr">{about.thesisFr}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <SectionHeading label="المسيرة المهنية" title="محطات في رحلة العطاء" />
          <div className="relative mx-auto mt-14 max-w-3xl">
            <div className="timeline-line" />
            <ul className="space-y-8">
              {timeline.map((t, i) => (
                <Reveal as="li" key={t.id} delay={Math.min(i * 50, 300)} className="relative ps-14">
                  <span className="absolute top-1 start-0 grid size-9 place-items-center rounded-full border border-steel-500/50 bg-cream text-steel-600 shadow-sm">
                    <Scale size={15} />
                  </span>
                  <span className="font-latin text-sm font-bold text-steel-600" dir="ltr">{t.yearLabel}</span>
                  <h3 className="font-display mt-1 text-lg font-bold text-ink-900">{t.title}</h3>
                  {t.description ? <p className="mt-1 text-sm leading-7 text-muted">{t.description}</p> : null}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Positions */}
      <section className="ink-surface py-16 md:py-24">
        <div className="container-x">
          <SectionHeading dark label="المناصب والعضويات" title="حضور محلي ودولي" />
          <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-steel-500/25 bg-white/[0.04] p-7">
                <h3 className="flex items-center gap-3 font-display text-xl font-bold text-steel-200">
                  <Globe size={21} className="text-steel-400" />
                  {about.intlTitle}
                </h3>
                <ul className="mt-6 space-y-4">
                  {about.intl.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-[#c6cfdf]">
                      <Check size={16} className="mt-1.5 shrink-0 text-steel-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full rounded-2xl border border-steel-500/25 bg-white/[0.04] p-7">
                <h3 className="flex items-center gap-3 font-display text-xl font-bold text-steel-200">
                  <Scale size={21} className="text-steel-400" />
                  {about.localTitle}
                </h3>
                <ul className="mt-6 space-y-4">
                  {about.local.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-[#c6cfdf]">
                      <Check size={16} className="mt-1.5 shrink-0 text-steel-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <SectionHeading label="الجوائز والتكريمات" title="تقدير الدولة والمنظمات الدولية" />
          <div className="mx-auto mt-14 grid max-w-5xl gap-7 md:grid-cols-3">
            {awards.map((a, i) => (
              <Reveal key={a.id} delay={i * 100}>
                <div className="card-elegant h-full p-7 text-center">
                  <span className="mx-auto grid size-16 place-items-center rounded-full border border-steel-500/40 bg-gradient-to-br from-steel-500/20 to-transparent text-steel-600">
                    <Icon name={a.icon} size={27} />
                  </span>
                  <span className="badge mt-4 bg-steel-500/12 text-steel-700">{a.year}</span>
                  <h3 className="font-display mt-3 text-lg font-bold leading-relaxed text-ink-900">{a.title}</h3>
                  <p className="mt-2.5 text-sm leading-7 text-muted">{a.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 text-center">
            <Link href="/services" className="btn btn-ink">تعرّف على خدماتنا القانونية</Link>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
