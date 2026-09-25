"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Scale, ArrowLeft, Globe2 } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { LANGUAGE_OPTIONS, NAV_LABELS, useSiteLanguage } from "@/components/site-language";

export type HeaderProps = {
  siteName: string;
  siteNameEn: string;
  tagline: string;
  headerCta: string;
};

const headerCopy = {
  ar: { cta: "احجز موعد", menu: "القائمة", language: "اللغة" },
  en: { cta: "Book an appointment", menu: "Menu", language: "Language" },
  fr: { cta: "Prendre rendez-vous", menu: "Menu", language: "Langue" },
} as const;

const siteNames = {
  ar: "أ.د/ حسام لطفي",
  en: "Dr. Hossam Loutfi",
  fr: "Dr Hossam Loutfi",
} as const;

const taglines = {
  ar: "مكتب المحاماة والاستشارات القانونية",
  en: "LAW FIRM & LEGAL CONSULTANCY",
  fr: "CABINET D’AVOCATS & CONSEIL JURIDIQUE",
} as const;

export function SiteHeader({ siteName, siteNameEn, tagline, headerCta }: HeaderProps) {
  const { language, setLanguage } = useSiteLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = headerCopy[language];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname, language]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-ink-950/92 backdrop-blur-xl shadow-[0_10px_40px_-18px_rgba(0,0,0,0.7)] border-b border-steel-500/15"
          : "bg-ink-950/60 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <div className="container-x">
        <div className="flex items-center justify-between gap-4 h-[4.5rem]">
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <span className="relative grid place-items-center size-11 shrink-0 rotate-45 rounded-[10px] border border-steel-400/60 bg-gradient-to-br from-steel-400/25 to-transparent transition-transform duration-500 group-hover:rotate-[135deg]">
              <Scale className="-rotate-45 text-steel-300 transition-transform duration-500 group-hover:-rotate-[135deg]" size={20} strokeWidth={1.6} />
            </span>
            <span className="leading-tight min-w-0">
              <span className="block font-display font-bold text-lg text-steel-100 truncate">
                {siteNames[language] || siteName}
              </span>
              <span className="block text-[9px] md:text-[10px] tracking-[0.18em] md:tracking-[0.28em] text-steel-400/90 font-latin uppercase truncate">
                {language === "ar" ? siteNameEn : language === "en" ? siteNameEn : "Dr. Hossam Loutfi"} <span className="text-steel-200/60">· {taglines[language] || tagline}</span>
              </span>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-5" aria-label={t.menu}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={cn("nav-link", pathname === l.href && "active")}>
                {NAV_LABELS[language][l.href] ?? l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="notranslate relative flex items-center rounded-full border border-steel-400/25 bg-ink-950/55 p-1" aria-label={t.language}>
              <Globe2 size={15} className="mx-1.5 text-steel-300/80" aria-hidden="true" />
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setLanguage(option.code)}
                  aria-pressed={language === option.code}
                  aria-label={option.label}
                  className={cn(
                    "notranslate rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-all duration-200",
                    language === option.code
                      ? "bg-steel-500 text-ink-950"
                      : "text-steel-200/80 hover:bg-white/10 hover:text-steel-100"
                  )}
                >
                  {option.code.toUpperCase()}
                </button>
              ))}
            </div>

            <Link href="/contact" className="btn btn-ink !py-2.5 !px-5 !text-sm hidden xl:inline-flex">
              {t.cta || headerCta}
              <ArrowLeft size={16} />
            </Link>
            <button onClick={() => setOpen(!open)} className="xl:hidden grid place-items-center size-11 rounded-lg border border-steel-500/30 text-steel-200" aria-label={t.menu} aria-expanded={open}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn("xl:hidden overflow-hidden transition-all duration-500 bg-ink-950/98 backdrop-blur-xl", open ? "max-h-[calc(100vh-4.5rem)] border-t border-steel-500/10" : "max-h-0")}>
        <nav className="container-x py-6 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-6rem)]" aria-label={t.menu}>
          {NAV_LINKS.map((l, i) => (
            <Link key={l.href} href={l.href} style={{ transitionDelay: `${i * 30}ms` }} className={cn("px-4 py-3 rounded-lg text-base font-medium transition-all duration-300", open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4", pathname === l.href ? "bg-steel-500/12 text-steel-300" : "text-[#cfd8ea] hover:bg-white/5 hover:text-steel-200")}>
              {NAV_LABELS[language][l.href] ?? l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-ink mt-4 w-full">
            {t.cta || headerCta}
            <ArrowLeft size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
