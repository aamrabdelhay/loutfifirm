"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type SiteLanguage = "ar" | "en" | "fr";
const STORAGE_KEY = "loutfi-site-language";
const GOOGLE_TRANSLATE_COOKIE = "googtrans";
const DEFAULT_LANGUAGE: SiteLanguage = "ar";

export const LANGUAGE_OPTIONS: Array<{ code: SiteLanguage; label: string; nativeLabel: string }> = [
  { code: "ar", label: "العربية", nativeLabel: "العربية" },
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "fr", label: "Français", nativeLabel: "Français" },
];

export const NAV_LABELS: Record<SiteLanguage, Record<string, string>> = {
  ar: { "/": "الرئيسية", "/about": "عن الدكتور", "/services": "الخدمات القانونية", "/academia": "الأكاديمية والبحث", "/articles": "المقالات", "/media": "وسائط ومحاضرات", "/training": "التدريب", "/faq": "اسألنا", "/contact": "تواصل معنا" },
  en: { "/": "Home", "/about": "About Dr. Loutfi", "/services": "Legal Services", "/academia": "Academia & Research", "/articles": "Articles", "/media": "Media & Lectures", "/training": "Training", "/faq": "FAQ", "/contact": "Contact" },
  fr: { "/": "Accueil", "/about": "À propos du Dr Loutfi", "/services": "Services juridiques", "/academia": "Académie & recherche", "/articles": "Articles", "/media": "Médias & conférences", "/training": "Formation", "/faq": "FAQ", "/contact": "Contact" },
};

const languageMeta: Record<SiteLanguage, { lang: string; dir: "rtl" | "ltr" }> = {
  ar: { lang: "ar", dir: "rtl" }, en: { lang: "en", dir: "ltr" }, fr: { lang: "fr", dir: "ltr" },
};

type SiteLanguageContextValue = { language: SiteLanguage; setLanguage: (language: SiteLanguage) => void };
const SiteLanguageContext = createContext<SiteLanguageContextValue | null>(null);

function isSiteLanguage(value: string | null): value is SiteLanguage {
  return value === "ar" || value === "en" || value === "fr";
}

function setGoogleTranslateCookie(language: SiteLanguage) {
  if (language === "ar") {
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; Path=/; Domain=${window.location.hostname}; Max-Age=0; SameSite=Lax`;
    return;
  }
  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=/ar/${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function SiteLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const cookieMatch = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
    const cookieLanguage = cookieMatch?.[1]?.split("/").pop() ?? null;
    setLanguageState(isSiteLanguage(cookieLanguage) ? cookieLanguage : isSiteLanguage(stored) ? stored : DEFAULT_LANGUAGE);

    const onLanguageChanged = (event: Event) => {
      const custom = event as CustomEvent<{ language?: string }>;
      const nextLanguage = custom.detail?.language ?? null;
      if (isSiteLanguage(nextLanguage)) setLanguageState(nextLanguage);
    };

    window.addEventListener("loutfi-language-change", onLanguageChanged);
    return () => window.removeEventListener("loutfi-language-change", onLanguageChanged);
  }, []);

  useEffect(() => {
    const meta = languageMeta[language];
    document.documentElement.lang = meta.lang;
    document.documentElement.dir = meta.dir;
    document.body.dir = meta.dir;
  }, [language]);

  const value = useMemo<SiteLanguageContextValue>(() => ({
    language,
    setLanguage(next) {
      setLanguageState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${STORAGE_KEY}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
      setGoogleTranslateCookie(next);
      window.dispatchEvent(new CustomEvent("loutfi-language-change", { detail: { language: next } }));
      // Always reload from the Arabic source so every server-rendered and database-backed text is translated.
      window.location.reload();
    },
  }), [language]);

  return <SiteLanguageContext.Provider value={value}>{children}</SiteLanguageContext.Provider>;
}

export function useSiteLanguage() {
  const context = useContext(SiteLanguageContext);
  if (!context) throw new Error("useSiteLanguage must be used inside SiteLanguageProvider");
  return context;
}

export function getSiteLanguage(value: string | null | undefined): SiteLanguage {
  const language = value ?? null;
  return isSiteLanguage(language) ? language : DEFAULT_LANGUAGE;
}
