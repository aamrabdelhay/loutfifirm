import Link from "next/link";
import { Check, Users, ArrowLeft, Star } from "lucide-react";
import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal, Icon, SectionHeading } from "@/components/ui";
import { listServices } from "@/lib/content";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [content, services] = await Promise.all([getContent(), listServices()]);

  return (
    <SiteShell>
      <PageHero
        label="الخدمات القانونية"
        title="حلول قانونية دقيقة لا استشارات عامة"
        crumb="الخدمات القانونية"
        description={content.pages.services}
      />

      <section className="py-16 md:py-24">
        <div className="container-x space-y-16 md:space-y-24">
          {services.map((s, i) => (
            <Reveal key={s.id}>
              <article
                className={cn(
                  "grid items-start gap-8 lg:grid-cols-2 lg:gap-14",
                  i % 2 === 1 && "lg:[&>*:first-child]:order-2"
                )}
              >
                {/* Info side */}
                <div>
                  <span className="flex items-center gap-4">
                    <span className="font-latin text-5xl font-semibold text-steel-500/45" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-14 place-items-center rounded-2xl bg-ink-900 text-steel-300 shadow-lg">
                      <Icon name={s.icon} size={26} />
                    </span>
                  </span>
                  <h2 className="font-display mt-5 text-3xl font-bold leading-snug text-ink-900">{s.title}</h2>
                  <p className="mt-4 text-[15px] leading-9 text-muted">{s.paragraph}</p>
                  {Array.isArray(s.audience) && (s.audience as string[]).length > 0 ? (
                    <div className="mt-6">
                      <p className="flex items-center gap-2 text-sm font-bold text-ink-800">
                        <Users size={16} className="text-steel-600" />
                        من نخدم في هذا المجال؟
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(s.audience as string[]).map((a) => (
                          <span key={a} className="badge border border-steel-500/40 bg-steel-500/8 text-[13px] text-ink-800">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Items side */}
                <div className="card-elegant p-7">
                  <p className="font-display text-lg font-bold text-ink-900">ماذا نقدم؟</p>
                  <ul className="mt-5 space-y-3.5">
                    {(s.items as string[]).map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-[#3c4a66]">
                        <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-steel-500/15 text-steel-600">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {s.note ? (
                    <div className="mt-6 flex gap-3 rounded-xl border border-steel-500/35 bg-steel-500/8 p-4">
                      <Star size={18} className="mt-0.5 shrink-0 text-steel-600" />
                      <p className="text-[13px] leading-7 text-ink-800">{s.note}</p>
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <Reveal>
            <div className="ink-surface rounded-[1.8rem] px-8 py-12 text-center md:py-16">
              <SectionHeading
                dark
                label="خطوتك التالية"
                title="ناقش قضيتك مع فريق متخصص"
              />
              <Link href="/contact" className="btn btn-ivory mt-8">
                اطلب استشارة قانونية
                <ArrowLeft size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
