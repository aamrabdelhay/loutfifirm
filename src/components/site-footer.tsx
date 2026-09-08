import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Smartphone, Scale, Lock, ArrowLeft } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import type { SiteContent } from "@/lib/default-content";

export function SiteFooter({ content }: { content: SiteContent }) {
  const { contact, footer, general } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="ink-surface text-[#c6cfdf] mt-0">
      <div className="h-px bg-gradient-to-l from-transparent via-steel-500/60 to-transparent" />
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center size-11 rotate-45 rounded-[10px] border border-steel-400/60 bg-gradient-to-br from-steel-400/25 to-transparent">
                <Scale className="-rotate-45 text-steel-300" size={20} strokeWidth={1.6} />
              </span>
              <span className="leading-tight">
                <span className="block font-display font-bold text-lg text-steel-100">{general.siteName}</span>
                <span className="block text-[10px] tracking-[0.35em] text-steel-400/90 font-latin uppercase">
                  {general.siteNameEn} · {general.tagline}
                </span>
              </span>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#aebad0]">{footer.description}</p>
            <div className="mt-5 flex items-center gap-2 text-steel-300 text-sm">
              <Mail size={16} />
              <a href={`mailto:${contact.email}`} className="hover:text-steel-100 transition-colors" dir="ltr">
                {contact.email}
              </a>
            </div>
          </div>

          {/* Offices */}
          <div>
            <h4 className="font-display text-steel-200 text-lg font-bold mb-5">عناوين المكاتب</h4>
            <ul className="space-y-4">
              {contact.offices.map((o) => (
                <li key={o.name} className="flex gap-3">
                  <MapPin size={17} className="text-steel-400 shrink-0 mt-1" />
                  <div>
                    <span className="block font-bold text-[#e8edf6] text-sm">{o.name}</span>
                    {o.lines.map((line) => (
                      <span key={line} className="block text-sm text-[#aebad0]">
                        {line}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-steel-200 text-lg font-bold mb-5">بيانات التواصل</h4>
            <ul className="space-y-3.5 text-sm">
              {contact.phones.map((p) => (
                <li key={p.label} className="flex gap-3">
                  <Phone size={16} className="text-steel-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[#aebad0] text-xs mb-0.5">{p.label}</span>
                    <span className="text-[#e8edf6]" dir="ltr">{p.value}</span>
                  </div>
                </li>
              ))}
              <li className="flex gap-3">
                <Smartphone size={16} className="text-steel-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[#aebad0] text-xs mb-0.5">محمول المكتب</span>
                  <span className="text-[#e8edf6]" dir="ltr">{contact.mobile}</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="text-steel-400 shrink-0 mt-0.5" />
                <span>{contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-steel-200 text-lg font-bold mb-5">روابط سريعة</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-1.5 text-[#aebad0] hover:text-steel-300 transition-colors"
                  >
                    <ArrowLeft size={13} className="text-steel-500/70 transition-transform group-hover:-translate-x-0.5" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#8fa0bd]">
          <p>
            {footer.note} © {year} — {general.siteName} {general.tagline === "LAW FIRM" ? "للمحاماة والاستشارات القانونية" : ""}
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 hover:text-steel-300 transition-colors"
          >
            <Lock size={13} />
            دخول الإدارة
          </Link>
        </div>
      </div>
    </footer>
  );
}
