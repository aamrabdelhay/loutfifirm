import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Amiri, Tajawal, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AssistantWidget } from "@/components/assistant-widget";
import { AdminResponsiveFix } from "@/components/admin-responsive-fix";
import { SiteLanguageProvider } from "@/components/site-language";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "أ.د/ حسام لطفي — مكتب المحاماة والاستشارات القانونية",
  description:
    "أستاذ القانون المدني ومحامٍ بالنقض وخبير الملكية الفكرية المعتمد لدى WIPO واليونسكو — أكثر من 40 عامًا في خدمة العدالة والعلم القانوني.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${tajawal.variable} ${playfair.variable}`}>
      <body className="min-h-screen">
        <SiteLanguageProvider>
          {children}
          <AdminResponsiveFix />
          <AssistantWidget />
        </SiteLanguageProvider>
      </body>
    </html>
  );
}
