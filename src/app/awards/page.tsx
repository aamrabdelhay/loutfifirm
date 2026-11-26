import type { Metadata } from "next";
import { Trophy, Users, Medal } from "lucide-react";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { listAwards } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الجوائز والعضويات والتكريمات — أ.د/ حسام لطفي" };

const GROUPS = [
  { kind: "award", title: "الجوائز", icon: Trophy },
  { kind: "membership", title: "العضويات المهنية", icon: Users },
  { kind: "honor", title: "التكريمات", icon: Medal },
] as const;

export default async function AwardsPage() {
  const awards = await listAwards();
  return (
    <SiteShell>
      <PageHero label="الإنجازات" title="الجوائز والعضويات والتكريمات" crumb="الجوائز" />
      <section className="py-16 md:py-24"><div className="container-x space-y-14">
        {awards.length === 0 ? <p className="text-center text-muted">لا توجد بيانات منشورة بعد.</p> : null}
        {GROUPS.map((g) => {
          const items = awards.filter((a) => (a.kind || "award") === g.kind);
          if (items.length === 0) return null;
          return (
            <div key={g.kind}>
              <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-ink-900"><g.icon className="text-steel-600" size={24} />{g.title}</h2>
              <div className="mt-3 h-px bg-gradient-to-l from-steel-500/50 to-transparent" />
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {items.map((a, i) => (
                  <Reveal key={a.id} delay={Math.min(i * 60, 300)}>
                    <div className="card-elegant h-full p-6">
                      {a.year ? <span className="badge border border-sand">{a.year}</span> : null}
                      <h3 className="font-display mt-3 text-xl font-bold text-ink-900">{a.title}</h3>
                      {a.description ? <p className="mt-2 text-sm leading-8 text-muted">{a.description}</p> : null}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div></section>
    </SiteShell>
  );
}
