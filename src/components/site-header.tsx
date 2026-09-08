"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Scale, ArrowLeft } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export type HeaderProps = {
  siteName: string;
  siteNameEn: string;
  tagline: string;
  headerCta: string;
};

export function SiteHeader({ siteName, siteNameEn, tagline, headerCta }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="relative grid place-items-center size-11 rotate-45 rounded-[10px] border border-steel-400/60 bg-gradient-to-br from-steel-400/25 to-transparent transition-transform duration-500 group-hover:rotate-[135deg]">
              <Scale className="-rotate-45 text-steel-300 transition-transform duration-500 group-hover:-rotate-[135deg]" size={20} strokeWidth={1.6} />
            </span>
            <span className="leading-tight">
              <span className="block font-display font-bold text-lg text-steel-100">{siteName}</span>
              <span className="block text-[10px] tracking-[0.35em] text-steel-400/90 font-latin uppercase">
                {siteNameEn.replace("Dr. ", "Dr. ")} <span className="text-steel-200/60">· {tagline}</span>
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn("nav-link", pathname === l.href && "active")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className="btn btn-ink !py-2.5 !px-5 !text-sm hidden xl:inline-flex">
              {headerCta}
              <ArrowLeft size={16} />
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden grid place-items-center size-11 rounded-lg border border-steel-500/30 text-steel-200"
              aria-label="القائمة"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "xl:hidden overflow-hidden transition-all duration-500 bg-ink-950/98 backdrop-blur-xl",
          open ? "max-h-[calc(100vh-4.5rem)] border-t border-steel-500/10" : "max-h-0"
        )}
      >
        <nav className="container-x py-6 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-6rem)]">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ transitionDelay: `${i * 30}ms` }}
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
                pathname === l.href
                  ? "bg-steel-500/12 text-steel-300"
                  : "text-[#cfd8ea] hover:bg-white/5 hover:text-steel-200"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-ink mt-4 w-full">
            {headerCta}
            <ArrowLeft size={16} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
