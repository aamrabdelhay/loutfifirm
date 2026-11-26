import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { LEGAL_UPDATED } from "./texts";

export function LegalPage({ title, items }: { title: string; items: { h: string; p: string }[] }) {
  return (
    <SiteShell>
      <PageHero label="قانوني" title={title} crumb={title} description={`آخر تحديث: ${LEGAL_UPDATED}`} />
      <section className="py-16"><div className="container-x max-w-3xl space-y-8">
        {items.map((x) => (<div key={x.h}><h2 className="mb-2 font-display text-xl font-bold text-ink-900">{x.h}</h2><p className="leading-9">{x.p}</p></div>))}
      </div></section>
    </SiteShell>
  );
}
