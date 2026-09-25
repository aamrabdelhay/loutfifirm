"use client";

import { useEffect } from "react";
import { AdminLanguageSwitcher } from "./admin-language";
import { useSiteLanguage, type SiteLanguage } from "@/components/site-language";

const baseToLanguage: Record<string, Record<SiteLanguage, string>> = {
  "لوحة المعلومات": { ar: "لوحة المعلومات", en: "Dashboard", fr: "Tableau de bord" },
  "محتوى الموقع": { ar: "محتوى الموقع", en: "Site Content", fr: "Contenu du site" },
  "المقالات": { ar: "المقالات", en: "Articles", fr: "Articles" },
  "الوسائط والفيديو": { ar: "الوسائط والفيديو", en: "Media & Video", fr: "Médias & vidéos" },
  "الكتب والمؤلفات": { ar: "الكتب والمؤلفات", en: "Books & Publications", fr: "Livres & publications" },
  "الخدمات القانونية": { ar: "الخدمات القانونية", en: "Legal Services", fr: "Services juridiques" },
  "الأسئلة الشائعة": { ar: "الأسئلة الشائعة", en: "FAQs", fr: "FAQ" },
  "المسيرة الزمنية": { ar: "المسيرة الزمنية", en: "Career Timeline", fr: "Parcours" },
  "الجوائز": { ar: "الجوائز", en: "Awards", fr: "Distinctions" },
  "طلبات التدريب": { ar: "طلبات التدريب", en: "Training Applications", fr: "Candidatures de formation" },
  "رسائل التواصل": { ar: "رسائل التواصل", en: "Contact Messages", fr: "Messages de contact" },
  "الإعدادات": { ar: "الإعدادات", en: "Settings", fr: "Paramètres" },
  "لوحة التحكم": { ar: "لوحة التحكم", en: "Admin Dashboard", fr: "Tableau de bord" },
  "معاينة الموقع": { ar: "معاينة الموقع", en: "Preview website", fr: "Aperçu du site" },
  "تسجيل الخروج": { ar: "تسجيل الخروج", en: "Sign out", fr: "Se déconnecter" },
  "كل ما تنشره هنا يظهر مباشرة على الموقع": { ar: "كل ما تنشره هنا يظهر مباشرة على الموقع", en: "Everything published here appears directly on the website", fr: "Tout ce qui est publié ici apparaît directement sur le site" },
  "حفظ المحتوى": { ar: "حفظ المحتوى", en: "Save content", fr: "Enregistrer le contenu" },
  "تم الحفظ": { ar: "تم الحفظ", en: "Saved", fr: "Enregistré" },
  "مقال منشور": { ar: "مقال منشور", en: "Published article", fr: "Article publié" },
  "فيديو / وسائط": { ar: "فيديو / وسائط", en: "Video / media", fr: "Vidéo / média" },
  "كتاب ومرجع": { ar: "كتاب ومرجع", en: "Book / reference", fr: "Livre / référence" },
  "خدمة قانونية": { ar: "خدمة قانونية", en: "Legal service", fr: "Service juridique" },
  "طلبات تدريب جديدة": { ar: "طلبات تدريب جديدة", en: "New training applications", fr: "Nouvelles candidatures" },
  "رسائل جديدة": { ar: "رسائل جديدة", en: "New messages", fr: "Nouveaux messages" },
  "حالة الأمان": { ar: "حالة الأمان", en: "Security status", fr: "État de sécurité" },
  "إدارة كلمة المرور": { ar: "إدارة كلمة المرور", en: "Manage password", fr: "Gérer le mot de passe" },
  "الجلسة": { ar: "الجلسة", en: "Session", fr: "Session" },
  "مساعد الإدارة بالذكاء الاصطناعي": { ar: "مساعد الإدارة بالذكاء الاصطناعي", en: "AI Administration Assistant", fr: "Assistant IA d’administration" },
  "إعدادات Gemini للمساعد الذكي": { ar: "إعدادات Gemini للمساعد الذكي", en: "Gemini AI Assistant Settings", fr: "Paramètres de l’assistant IA Gemini" },
  "كلمة مرور لوحة التحكم": { ar: "كلمة مرور لوحة التحكم", en: "Admin Dashboard Password", fr: "Mot de passe du tableau de bord" },
  "حفظ إعدادات Gemini": { ar: "حفظ إعدادات Gemini", en: "Save Gemini settings", fr: "Enregistrer les paramètres Gemini" },
  "استبدال المفتاح": { ar: "استبدال المفتاح", en: "Replace key", fr: "Remplacer la clé" },
  "إلغاء": { ar: "إلغاء", en: "Cancel", fr: "Annuler" },
  "حفظ": { ar: "حفظ", en: "Save", fr: "Enregistrer" },
  "Gemini متصل": { ar: "Gemini متصل", en: "Gemini connected", fr: "Gemini connecté" },
  "Gemini API Key": { ar: "Gemini API Key", en: "Gemini API Key", fr: "Clé API Gemini" },
  "Gemini Model": { ar: "Gemini Model", en: "Gemini Model", fr: "Modèle Gemini" },
  "تعذر حفظ المحتوى": { ar: "تعذر حفظ المحتوى", en: "Could not save content", fr: "Impossible d’enregistrer le contenu" },
  "تعذر حفظ كلمة المرور.": { ar: "تعذر حفظ كلمة المرور.", en: "Could not save the password.", fr: "Impossible d’enregistrer le mot de passe." },
  "تعذر حفظ إعدادات Gemini.": { ar: "تعذر حفظ إعدادات Gemini.", en: "Could not save Gemini settings.", fr: "Impossible d’enregistrer les paramètres Gemini." },
};

const attributeBase: Record<string, Record<SiteLanguage, string>> = {
  "مثال: غيّر عنوان الخدمة الأولى إلى ... أو أضف سؤالًا شائعًا عن التدريب": {
    ar: "مثال: غيّر عنوان الخدمة الأولى إلى ... أو أضف سؤالًا شائعًا عن التدريب",
    en: "Example: Change the first service title to ... or add an FAQ about training",
    fr: "Exemple : changez le titre du premier service… ou ajoutez une FAQ sur la formation",
  },
  "اتركها فارغة لإزالة كلمة المرور": { ar: "اتركها فارغة لإزالة كلمة المرور", en: "Leave empty to remove the password", fr: "Laissez vide pour supprimer le mot de passe" },
  "اكتب كلمة المرور الجديدة": { ar: "اكتب كلمة المرور الجديدة", en: "Enter the new password", fr: "Saisissez le nouveau mot de passe" },
};

function buildReverseMap(language: SiteLanguage) {
  const map = new Map<string, string>();
  for (const [base, values] of Object.entries(baseToLanguage)) {
    for (const value of Object.values(values)) map.set(value, values[language]);
    map.set(base, values[language]);
  }
  return map;
}

function translate(root: HTMLElement, language: SiteLanguage) {
  const map = buildReverseMap(language);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const value = node.nodeValue?.trim();
    if (!value || node.parentElement?.closest("script, style, .notranslate, [translate=\"no\"]")) continue;
    const next = map.get(value);
    if (next && next !== value) node.nodeValue = node.nodeValue!.replace(value, next);
  }

  const placeholders = new Map<string, string>();
  for (const values of Object.values(attributeBase)) {
    const target = values[language];
    for (const value of Object.values(values)) placeholders.set(value, target);
  }
  root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((el) => {
    const placeholder = el.getAttribute("placeholder");
    if (placeholder && placeholders.has(placeholder)) el.setAttribute("placeholder", placeholders.get(placeholder)!);
  });
}

export function AdminLanguageLayer() {
  const { language } = useSiteLanguage();

  useEffect(() => {
    const apply = () => translate(document.body, language);
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  return <div className="fixed top-4 end-4 z-[100]"><AdminLanguageSwitcher /></div>;
}
