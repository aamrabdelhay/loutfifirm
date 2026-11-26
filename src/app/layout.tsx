import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Amiri, Tajawal, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AssistantWidget } from "@/components/assistant-widget";
import { AdminResponsiveFix } from "@/components/admin-responsive-fix";
import { SiteLanguageProvider } from "@/components/site-language";
import { CallBar } from "@/features/call/call-bar";
import { LeadSourceCapture } from "@/features/tracking/capture";
import { CookieBanner } from "@/features/legal/cookie-banner";
import { SiteJsonLd } from "@/features/seo/json-ld";
import { SITE_URL } from "@/lib/site";
import { GoogleTranslateBridge } from "@/components/google-translate-bridge";

const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri" });
const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "700", "800"], variable: "--font-tajawal" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-playfair" });

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const locale = h.get("x-site-locale"); // "en" | "fr" on locale URLs, null on the Arabic default
  const path = h.get("x-site-path") || h.get("x-invoke-path") || "/";
  const suffix = path === "/" ? "" : path;
  return {
    metadataBase: new URL(SITE_URL),
    title: "أ.د/ حسام لطفي — مكتب المحاماة والاستشارات القانونية",
    description: "أستاذ القانون المدني ومحامٍ بالنقض وخبير الملكية الفكرية المعتمد لدى WIPO واليونسكو — أكثر من 40 عامًا في خدمة العدالة والعلم القانوني.",
    alternates: {
      canonical: locale ? `/${locale}${suffix}` : suffix || "/",
      languages: { ar: suffix || "/", en: `/en${suffix}`, fr: `/fr${suffix}`, "x-default": suffix || "/" },
    },
    // Locale pages are machine-translated in the browser, so keep them out of search until the office opts in.
    robots: locale && process.env.INDEX_LOCALES !== "1" ? { index: false, follow: true } : undefined,
    openGraph: { type: "website", locale: locale === "en" ? "en_US" : locale === "fr" ? "fr_FR" : "ar_EG", siteName: "أ.د/ حسام لطفي" },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${tajawal.variable} ${playfair.variable}`}>
      <head>
        <style>{`#google_translate_element{display:none!important}iframe.goog-te-banner-frame{display:none!important}body{top:0!important}.skiptranslate{display:none!important}`}</style>
      </head>
      <body className="min-h-screen">
        <SiteLanguageProvider>
          <GoogleTranslateBridge />
          {children}
          <AdminResponsiveFix />
          <AssistantWidget />
          <CallBar />
          <LeadSourceCapture />
          <CookieBanner />
          <SiteJsonLd />
        </SiteLanguageProvider>
      </body>
    </html>
  );
}
