"use client";

import { useEffect } from "react";
import { AdminLanguageSwitcher } from "./admin-language";
import { useSiteLanguage, type SiteLanguage } from "@/components/site-language";

const translations: Record<SiteLanguage, Record<string, string>> = {
  ar: {
    "لوحة المعلومات": "لوحة المعلومات", "محتوى الموقع": "محتوى الموقع", "المقالات": "المقالات", "الوسائط والفيديو": "الوسائط والفيديو",
    "الكتب والمؤلفات": "الكتب والمؤلفات", "الخدمات القانونية": "الخدمات القانونية", "الأسئلة الشائعة": "الأسئلة الشائعة", "المسيرة الزمنية": "المسيرة الزمنية",
    "الجوائز": "الجوائز", "طلبات التدريب": "طلبات التدريب", "رسائل التواصل": "رسائل التواصل", "الإعدادات": "الإعدادات",
    "لوحة التحكم": "لوحة التحكم", "معاينة الموقع": "معاينة الموقع", "تسجيل الخروج": "تسجيل الخروج", "محتوى الموقع يظهر هنا": "كل ما تنشره هنا يظهر مباشرة على الموقع",
    "كل ما تنشره هنا يظهر مباشرة على الموقع": "كل ما تنشره هنا يظهر مباشرة على الموقع", "حفظ المحتوى": "حفظ المحتوى", "تم الحفظ": "تم الحفظ",
    "مقال منشور": "مقال منشور", "فيديو / وسائط": "فيديو / وسائط", "كتاب ومرجع": "كتاب ومرجع", "خدمة قانونية": "خدمة قانونية", "طلبات تدريب جديدة": "طلبات تدريب جديدة", "رسائل جديدة": "رسائل جديدة",
    "حالة الأمان": "حالة الأمان", "إدارة كلمة المرور": "إدارة كلمة المرور", "حالة الجلسة": "الجلسة", "الجلسة": "الجلسة",
    "مساعد الإدارة بالذكاء الاصطناعي": "مساعد الإدارة بالذكاء الاصطناعي", "إعدادات Gemini للمساعد الذكي": "إعدادات Gemini للمساعد الذكي",
    "كلمة مرور لوحة التحكم": "كلمة مرور لوحة التحكم", "إعدادات Gemini": "إعدادات Gemini", "حفظ إعدادات Gemini": "حفظ إعدادات Gemini", "استبدال المفتاح": "استبدال المفتاح", "إلغاء": "إلغاء", "حفظ": "حفظ",
    "إدارة كلمة المرور": "إدارة كلمة المرور", "Gemini متصل": "Gemini متصل", "Gemini API Key": "Gemini API Key", "Gemini Model": "Gemini Model",
  },
  en: {
    "لوحة المعلومات": "Dashboard", "محتوى الموقع": "Site Content", "المقالات": "Articles", "الوسائط والفيديو": "Media & Video",
    "الكتب والمؤلفات": "Books & Publications", "الخدمات القانونية": "Legal Services", "الأسئلة الشائعة": "FAQs", "المسيرة الزمنية": "Career Timeline",
    "الجوائز": "Awards", "طلبات التدريب": "Training Applications", "رسائل التواصل": "Contact Messages", "الإعدادات": "Settings",
    "لوحة التحكم": "Admin Dashboard", "معاينة الموقع": "Preview website", "تسجيل الخروج": "Sign out", "كل ما تنشره هنا يظهر مباشرة على الموقع": "Everything published here appears directly on the website",
    "حفظ المحتوى": "Save content", "تم الحفظ": "Saved",
    "مقال منشور": "Published article", "فيديو / وسائط": "Video / media", "كتاب ومرجع": "Book / reference", "خدمة قانونية": "Legal service", "طلبات تدريب جديدة": "New training applications", "رسائل جديدة": "New messages",
    "حالة الأمان": "Security status", "إدارة كلمة المرور": "Manage password", "الجلسة": "Session",
    "مساعد الإدارة بالذكاء الاصطناعي": "AI Administration Assistant", "إعدادات Gemini للمساعد الذكي": "Gemini AI Assistant Settings",
    "كلمة مرور لوحة التحكم": "Admin Dashboard Password", "حفظ إعدادات Gemini": "Save Gemini settings", "استبدال المفتاح": "Replace key", "إلغاء": "Cancel", "حفظ": "Save",
    "Gemini متصل": "Gemini connected", "Gemini API Key": "Gemini API Key", "Gemini Model": "Gemini Model",
    "تعذر تحميل بيانات الإدارة — حاول تحديث الصفحة.": "Could not load admin data — please refresh the page.",
    "تعذر حفظ المحتوى": "Could not save content", "تعذر حفظ كلمة المرور.": "Could not save the password.", "تعذر حفظ إعدادات Gemini.": "Could not save Gemini settings.",
    "حماية المفتاح": "Key protection",
  },
  fr: {
    "لوحة المعلومات": "Tableau de bord", "محتوى الموقع": "Contenu du site", "المقالات": "Articles", "الوسائط والفيديو": "Médias & vidéos",
    "الكتب والمؤلفات": "Livres & publications", "الخدمات القانونية": "Services juridiques", "الأسئلة الشائعة": "FAQ", "المسيرة الزمنية": "Parcours",
    "الجوائز": "Distinctions", "طلبات التدريب": "Candidatures de formation", "رسائل التواصل": "Messages de contact", "الإعدادات": "Paramètres",
    "لوحة التحكم": "Tableau de bord", "معاينة الموقع": "Aperçu du site", "تسجيل الخروج": "Se déconnecter", "كل ما تنشره هنا يظهر مباشرة على الموقع": "Tout ce qui est publié ici apparaît directement sur le site",
    "حفظ المحتوى": "Enregistrer le contenu", "تم الحفظ": "Enregistré",
    "مقال منشور": "Article publié", "فيديو / وسائط": "Vidéo / média", "كتاب ومرجع": "Livre / référence", "خدمة قانونية": "Service juridique", "طلبات تدريب جديدة": "Nouvelles candidatures", "رسائل جديدة": "Nouveaux messages",
    "حالة الأمان": "État de sécurité", "إدارة كلمة المرور": "Gérer le mot de passe", "الجلسة": "Session",
    "مساعد الإدارة بالذكاء الاصطناعي": "Assistant IA d’administration", "إعدادات Gemini للمساعد الذكي": "Paramètres de l’assistant IA Gemini",
    "كلمة مرور لوحة التحكم": "Mot de passe du tableau de bord", "حفظ إعدادات Gemini": "Enregistrer les paramètres Gemini", "استبدال المفتاح": "Remplacer la clé", "إلغاء": "Annuler", "حفظ": "Enregistrer",
    "Gemini متصل": "Gemini connecté", "Gemini API Key": "Clé API Gemini", "Gemini Model": "Modèle Gemini",
    "تعذر تحميل بيانات الإدارة — حاول تحديث الصفحة.": "Impossible de charger les données d’administration — actualisez la page.",
    "تعذر حفظ المحتوى": "Impossible d’enregistrer le contenu", "تعذر حفظ كلمة المرور.": "Impossible d’enregistrer le mot de passe.", "تعذر حفظ إعدادات Gemini.": "Impossible d’enregistrer les paramètres Gemini.",
  },
};

const attributeTranslations: Record<SiteLanguage, Record<string, string>> = {
  ar: {
    "مثال: غيّر عنوان الخدمة الأولى إلى ... أو أضف سؤالًا شائعًا عن التدريب": "مثال: غيّر عنوان الخدمة الأولى إلى ... أو أضف سؤالًا شائعًا عن التدريب",
    "اتركها فارغة لإزالة كلمة المرور": "اتركها فارغة لإزالة كلمة المرور", "اكتب كلمة المرور الجديدة": "اكتب كلمة المرور الجديدة",
  },
  en: {
    "مثال: غيّر عنوان الخدمة الأولى إلى ... أو أضف سؤالًا شائعًا عن التدريب": "Example: Change the first service title to ... or add an FAQ about training",
    "اتركها فارغة لإزالة كلمة المرور": "Leave empty to remove the password", "اكتب كلمة المرور الجديدة": "Enter the new password",
  },
  fr: {
    "مثال: غيّر عنوان الخدمة الأولى إلى ... أو أضف سؤالًا شائعًا عن التدريب": "Exemple : changez le titre du premier service… ou ajoutez une FAQ sur la formation",
    "اتركها فارغة لإزالة كلمة المرور": "Laissez vide pour supprimer le mot de passe", "اكتب كلمة المرور الجديدة": "Saisissez le nouveau mot de passe",
  },
};

function translate(root: HTMLElement, language: SiteLanguage) {
  const map = translations[language];
  const attrs = attributeTranslations[language];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const value = node.nodeValue?.trim();
    if (!value || !map[value]) continue;
    if (node.parentElement?.closest("script, style")) continue;
    node.nodeValue = node.nodeValue!.replace(value, map[value]);
  }
  root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((el) => {
    const placeholder = el.getAttribute("placeholder");
    if (placeholder && attrs[placeholder]) el.setAttribute("placeholder", attrs[placeholder]);
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
