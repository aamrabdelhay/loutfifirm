import { PhoneValue } from "@/features/call/phone-value";
import { isMobileLabel, effectiveMobile } from "@/features/call/phone-check";
import { MapPin, Phone, Mail, Clock, Smartphone } from "lucide-react";
import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal, SectionHeading } from "@/components/ui";
import { BookingForm } from "@/features/booking/booking-form";
import { BranchMap } from "@/features/map/branch-map";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getContent();
  const { contact } = content;

  return (
    <SiteShell>
      <PageHero
        label="حجز موعد"
        title="طلب موعد"
        crumb="طلب موعد"
        description="أرسل بياناتك وطلبك، وسيقوم فريق المكتب بالتواصل معك لتحديد الموعد المناسب وتأكيده."
      />

      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <Reveal>
              <SectionHeading label="طلب موعد" title="أرسل طلب موعد" intro="سيتم تحديد الموعد المناسب لحضرتك بعد مراجعة طلبك، وسيتواصل معك فريق المكتب لتأكيد الموعد." center={false} />
              <div className="mt-8">
                <BookingForm offices={contact.offices} />
              </div>
            </Reveal>

            {/* Info */}
            <div className="space-y-6">
              <Reveal delay={100}>
                <div className="ink-surface rounded-2xl p-7">
                  <h3 className="font-display text-xl font-bold text-steel-200">بيانات التواصل</h3>
                  <ul className="mt-5 space-y-4 text-sm">
                    <li className="flex gap-3">
                      <Mail size={17} className="mt-1 shrink-0 text-steel-400" />
                      <div>
                        <span className="block text-xs text-[#9fadc6]">البريد الإلكتروني</span>
                        <a href={`mailto:${contact.email}`} className="text-steel-100 transition-colors hover:text-steel-300" dir="ltr">
                          {contact.email}
                        </a>
                      </div>
                    </li>
                    {contact.phones.filter((p) => !isMobileLabel(p.label)).map((p) => (
                      <li key={p.label} className="flex gap-3">
                        <Phone size={17} className="mt-1 shrink-0 text-steel-400" />
                        <div>
                          <span className="block text-xs text-[#9fadc6]">{p.label}</span>
                          <PhoneValue value={p.value} mobile={false} className="text-steel-100" />
                        </div>
                      </li>
                    ))}
                    {effectiveMobile(contact) ? (
                      <li className="flex gap-3">
                        <Smartphone size={17} className="mt-1 shrink-0 text-steel-400" />
                        <div>
                          <span className="block text-xs text-[#9fadc6]">محمول المكتب</span>
                          <PhoneValue value={effectiveMobile(contact)} mobile className="text-steel-100" />
                        </div>
                      </li>
                    ) : null}
                    <li className="flex gap-3">
                      <Clock size={17} className="mt-1 shrink-0 text-steel-400" />
                      <span className="mt-0.5 text-[#d5dcee]">{contact.hours}</span>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={180}>
                <div className="card-elegant p-7">
                  <h3 className="font-display text-xl font-bold text-ink-900">عناوين المكاتب</h3>
                  <ul className="mt-5 space-y-4">
                    {contact.offices.map((o) => (
                      <li key={o.name} className="flex gap-3">
                        <MapPin size={17} className="mt-1 shrink-0 text-steel-600" />
                        <div>
                          <span className="block text-sm font-bold text-ink-800">{o.name}</span>
                          {o.lines.map((line) => (
                            <span key={line} className="block text-sm leading-7 text-muted">{line}</span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-x">
          <Reveal>
            <SectionHeading label="الفروع" title="مواقع الفروع الثلاثة" intro="اختر الفرع لعرض موقعه وطريقة الوصول إليه." center={false} />
            <div className="mt-8"><BranchMap offices={contact.offices} /></div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
