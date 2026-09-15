import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Smartphone, Scale, Lock, ArrowLeft } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import type { SiteContent } from "@/lib/default-content";

export function SiteFooter({ content }: { content: SiteContent }) {
  const { contact, footer, general } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="ink-surface mt-0 text-[#c6cfdf]">
      <div className="h-px bg-gradient-to-l from-transparent via-steel-500/60 to-transparent" />
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-11 rotate-45 place-items-center rounded-[10px] border border-steel-400/60 bg-gradient-to-br from-steel-400/25 to-transparent">
                <Scale className="-rotate-45 text-steel-300" size={20} strokeWidth={1.6} />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-bold text-steel-100">{general.siteName}</span>
                <span className="block font-latin text-[10px] uppercase tracking-[0.35em] text-steel-400/90">
                  {general.siteNameEn} · {general.tagline}
                </span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#aebad0]">{footer.description}</p>
            <div className="mt-5 flex items-center gap-2 text-sm text-steel-300">
              <Mail size={16} />
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-steel-100" dir="ltr">
                {contact.email}
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-display text-lg font-bold text-steel-200">عناوين المكاتب</h4>
            <ul className="space-y-4">
              {contact.offices.map((o) => (
                <li key={o.name} className="flex gap-3">
                  <MapPin size={17} className="mt-1 shrink-0 text-steel-400" />
                  <div className="min-w-0">
                    <span className="block text-sm font-bold text-[#e8edf6]">{o.name}</span>
                    {o.lines.map((line) => <span key={line} className="block text-sm text-[#aebad0]">{line}</span>)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-display text-lg font-bold text-steel-200">بيانات التواصل</h4>
            <ul className="space-y-3.5 text-sm">
              {contact.phones.map((p) => (
                <li key={p.label} className="flex gap-3">
                  <Phone size={16} className="mt-0.5 shrink-0 text-steel-400" />
                  <div className="min-w-0">
                    <span className="mb-0.5 block text-xs text-[#aebad0]">{p.label}</span>
                    <span className="break-words text-[#e8edf6]" dir="ltr">{p.value}</span>
                  </div>
                </li>
              ))}
              <li className="flex gap-3">
                <Smartphone size={16} className="mt-0.5 shrink-0 text-steel-400" />
                <div className="min-w-0">
                  <span className="mb-0.5 block text-xs text-[#aebad0]">محمول المكتب</span>
                  <span className="break-words text-[#e8edf6]" dir="ltr">{contact.mobile}</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-steel-400" />
                <span className="min-w-0 leading-6">{contact.hours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-display text-lg font-bold text-steel-200">روابط سريعة</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href} className="min-w-0">
                  <Link href={l.href} className="group inline-flex max-w-full items-center gap-1.5 text-[#aebad0] transition-colors hover:text-steel-300">
                    <ArrowLeft size={13} className="shrink-0 text-steel-500/70 transition-transform group-hover:-translate-x-0.5" />
                    <span className="truncate">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-x flex flex-col items-center gap-4 py-5 text-center text-xs text-[#8fa0bd] md:gap-3">
          <p className="flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 leading-6">
            <span>جميع الحقوق محفوظة</span>
            <span aria-hidden="true">·</span>
            <span dir="ltr" className="inline-block">Designed &amp; Developed by Amr Abdelhay</span>
            <span aria-hidden="true">·</span>
            <span dir="ltr" className="inline-block">© {year}</span>
            <span aria-hidden="true">—</span>
            <span>أ.د/ حسام لطفي للمحاماة والاستشارات القانونية</span>
          </p>
          <Link href="/admin" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-steel-500/25 px-4 py-2 text-steel-300 transition-colors hover:border-steel-400/45 hover:bg-white/5 hover:text-steel-100">
            <Lock size={14} />
            <span>دخول الإدارة</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
