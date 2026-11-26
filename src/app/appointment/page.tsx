import type { Metadata } from "next";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { ManagePanel } from "@/features/booking/manage-panel";

export const metadata: Metadata = { title: "إدارة طلب الموعد", robots: { index: false, follow: false } };

export default async function AppointmentPage({ searchParams }: { searchParams: Promise<{ id?: string; t?: string }> }) {
  const { id, t } = await searchParams;
  return (
    <SiteShell>
      <PageHero label="طلب الموعد" title="إدارة طلب الموعد" crumb="طلب الموعد" description="اعرض حالة طلبك، أو اطلب تعديل الموعد أو إلغاءه." />
      <section className="py-16 md:py-24">
        <div className="container-x max-w-2xl">
          {id && t ? <ManagePanel id={id} token={t} /> : <p className="card-elegant p-8 text-center text-muted">استخدم الرابط الذي ظهر لك بعد إرسال الطلب.</p>}
        </div>
      </section>
    </SiteShell>
  );
}
