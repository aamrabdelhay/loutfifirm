import Link from "next/link";
import { ChevronDown, MessageCircleQuestion, ArrowLeft } from "lucide-react";
import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal, SectionHeading } from "@/components/ui";
import { listFaqs } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const [content, faqs] = await Promise.all([getContent(), listFaqs()]);

  return (
    <SiteShell>
      <PageHero
        label="اسألنا"
        title="الأسئلة الأكثر شيوعًا"
        crumb="اسألنا"
        description={content.pages.faq}
      />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((f, i) => (
              <Reveal key={f.id} delay={Math.min(i * 60, 300)}>
                <details className="faq-item card-elegant group overflow-hidden">
                  <summary className="flex items-center gap-4 p-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-steel-500/12 text-steel-600">
                      <MessageCircleQuestion size={19} />
                    </span>
                    <span className="flex-1 font-display text-lg font-bold text-ink-900">{f.question}</span>
                    <ChevronDown size={19} className="faq-chevron shrink-0 text-steel-600" />
                  </summary>
                  <div className="px-6 pb-6 ps-20">
                    <p className="text-[15px] leading-9 text-muted">{f.answer}</p>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 text-center">
            <SectionHeading label="لم تجد إجابتك؟" title="اسألنا مباشرة" center />
            <Link href="/contact" className="btn btn-ink mt-8">
              أرسل استفسارك
              <ArrowLeft size={17} />
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
