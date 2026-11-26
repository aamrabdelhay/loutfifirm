import type { Metadata } from "next";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { IntakeForm } from "@/features/intake/intake-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "استقبال العملاء — أ.د/ حسام لطفي" };

export default function IntakePage() {
  return (
    <SiteShell>
      <PageHero label="استقبال العملاء" title="أرسل موضوعك للمكتب" crumb="استقبال العملاء" description="حدد نوع الموضوع ودرجة الاستعجال والمستندات المتوفرة، ليراجعها فريق المكتب ويتواصل معك." />
      <section className="py-16 md:py-24">
        <div className="container-x max-w-3xl">
          <Reveal><IntakeForm /></Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
