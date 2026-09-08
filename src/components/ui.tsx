"use client";

import {
  GraduationCap,
  Scale,
  Globe,
  BookOpen,
  Trophy,
  Landmark,
  Medal,
  Lightbulb,
  FileText,
  Music,
  Building2,
  Award,
  Gavel,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Scale,
  Globe,
  BookOpen,
  Trophy,
  Landmark,
  Medal,
  Lightbulb,
  FileText,
  Music,
  Building2,
  Award,
  Gavel,
  ShieldCheck,
  Sparkles,
};

export function Icon({
  name,
  className,
  size,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = ICONS[name] ?? Scale;
  return <Cmp className={className} size={size} strokeWidth={1.6} />;
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  label,
  title,
  intro,
  dark = false,
  center = true,
}: {
  label?: string;
  title: string;
  intro?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-3xl", center && "mx-auto text-center")}>
      {label ? <span className={cn("section-label", dark && "on-dark")}>{label}</span> : null}
      <h2
        className={cn(
          "font-display text-3xl md:text-[2.6rem] leading-[1.35] font-bold mt-3",
          dark ? "text-steel-100" : "text-ink-900"
        )}
      >
        {title}
      </h2>
      {intro ? (
        <p className={cn("mt-4 text-base md:text-lg leading-8", dark ? "text-[#c6cfdf]" : "text-muted")}>
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
