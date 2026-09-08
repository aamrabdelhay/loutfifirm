import { BookOpen, Gavel, Users, Award } from "lucide-react";
import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal, SectionHeading } from "@/components/ui";
import { TrainingForm } from "@/components/forms";

export const dynamic = "force-dynamic";

const PERKS = [
  { icon: Gavel, title: "تدريب عملي", text: "اطلاع مباشر على ملفات قضايا حقيقية أمام المحاكم وهيئات التحكيم" },
  { icon: BookOpen, title: "بحث علمي", text: "منهجية البحث القانوني الأكاديمي بإشراف أستاذ جامعي متخصص" },
  { icon: Users, title: "شبكة علاقات", text: "احتكاك بمحامين وباحثين وكيانات ثقافية وإبداعية كبرى" },
  { icon: Award, title: "شهادة معتمدة", text: "شهادة تدريب من مكتب أ.د/ حسام لطفي عند إتمام البرنامج" },
];

export default async function TrainingPage() {
  const content = await getContent();
  const { training } = content;

  return (
    <SiteShell>
      <PageHero
        label="بوابة المتدربين"
        title={training.title}
        crumb="التدريب"
        description={training.intro}
      />

      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <Reveal>
              <TrainingForm successMessage={training.success} />
            </Reveal>

            <div className="space-y-5">
              <Reveal delay={120}>
                <h2 className="font-display text-2xl font-bold text-ink-900">لماذا التدريب لدينا؟</h2>
              </Reveal>
              {PERKS.map((p, i) => (
                <Reveal key={p.title} delay={150 + i * 70}>
                  <div className="card-elegant flex gap-4 p-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-900 text-steel-300">
                      <p.icon size={21} />
                    </span>
                    <div>
                      <h3 className="font-bold text-ink-900">{p.title}</h3>
                      <p className="mt-1 text-[13px] leading-7 text-muted">{p.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={400}>
                <div className="ink-surface rounded-2xl p-6 text-center">
                  <p className="font-display text-lg font-bold leading-relaxed text-steel-100">
                    «القانون الجيد يُبنى على علم راسخ وممارسة صادقة»
                  </p>
                  <p className="mt-2 text-xs text-[#aebad0]">أ.د/ حسام لطفي</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
