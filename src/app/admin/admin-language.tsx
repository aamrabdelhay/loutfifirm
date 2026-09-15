"use client";

import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANGUAGE_OPTIONS, useSiteLanguage, type SiteLanguage } from "@/components/site-language";

const labels: Record<SiteLanguage, { aria: string; site: string }> = {
  ar: { aria: "لغة لوحة الإدارة", site: "لغة الموقع" },
  en: { aria: "Admin language", site: "Site language" },
  fr: { aria: "Langue de l’administration", site: "Langue du site" },
};

export function AdminLanguageSwitcher() {
  const { language, setLanguage } = useSiteLanguage();
  const t = labels[language];

  return (
    <div className="inline-flex items-center rounded-full border border-sand bg-white/90 p-1 shadow-sm" aria-label={t.aria} title={t.site}>
      <Globe2 size={16} className="mx-1.5 text-steel-700" aria-hidden="true" />
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLanguage(option.code)}
          aria-pressed={language === option.code}
          aria-label={option.label}
          className={cn(
            "rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-colors",
            language === option.code
              ? "bg-ink-900 text-steel-200"
              : "text-ink-700 hover:bg-sand/70"
          )}
        >
          {option.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
