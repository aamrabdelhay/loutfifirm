import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Reveal } from "./ui";

export function PageHero({
  label,
  title,
  description,
  crumb,
}: {
  label: string;
  title: string;
  description?: string;
  crumb: string;
}) {
  return (
    <section className="ink-surface page-hero pt-36 pb-16 md:pt-44 md:pb-20">
      <div className="container-x">
        <Reveal>
          <div className="crumbs flex items-center gap-1.5 mb-5">
            <Link href="/" className="hover:text-steel-300 transition-colors">الرئيسية</Link>
            <ChevronLeft size={14} className="text-steel-500" />
            <span className="text-steel-300">{crumb}</span>
          </div>
          <span className="section-label on-dark">{label}</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-steel-100 mt-3 leading-[1.3]">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-3xl text-[#c6cfdf] text-base md:text-lg leading-8">{description}</p>
          ) : null}
        </Reveal>
      </div>
      <div className="absolute -bottom-px inset-x-0 h-px bg-gradient-to-l from-transparent via-steel-500/50 to-transparent" />
    </section>
  );
}
