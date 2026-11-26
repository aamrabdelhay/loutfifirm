import type { Metadata } from "next";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { TrainingPortal } from "@/features/training/portal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "بوابة المتدربين", robots: { index: false, follow: false } };

export default function PortalPage() {
  return (
    <SiteShell>
      <PageHero label="التدريب" title="بوابة المتدربين" crumb="بوابة المتدربين" description="أدخل كود مجموعتك لعرض المحاضرات والتكليفات." />
      <section className="py-16"><div className="container-x max-w-2xl"><TrainingPortal /></div></section>
    </SiteShell>
  );
}
