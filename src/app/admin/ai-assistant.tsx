"use client";

import { useState } from "react";
import { Bot, Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { adminFetch } from "./api-client";
import { useSiteLanguage, type SiteLanguage } from "@/components/site-language";

const copy: Record<SiteLanguage, {
  title: string;
  description: string;
  placeholder: string;
  execute: string;
  running: string;
  content: string;
  items: string;
  tabs: string;
  done: string;
  error: string;
}> = {
  ar: {
    title: "مساعد الإدارة بالذكاء الاصطناعي",
    description: "اكتب ما تريد تعديله بصيغة طبيعية. المساعد يفهم محتوى لوحة الإدارة وينفذ التعديلات على البيانات مباشرة.",
    placeholder: "مثال: غيّر عنوان الخدمة الأولى إلى ... أو أضف سؤالًا شائعًا عن التدريب",
    execute: "تنفيذ",
    running: "جارٍ التنفيذ…",
    content: "تعديل المحتوى",
    items: "إضافة/تعديل/حذف العناصر",
    tabs: "فتح تبويب الإدارة",
    done: "تم تنفيذ الطلب.",
    error: "تعذر تنفيذ الطلب.",
  },
  en: {
    title: "AI Administration Assistant",
    description: "Describe what you want to change in natural language. The assistant understands the admin content and applies data changes directly.",
    placeholder: "Example: Change the first service title to ... or add an FAQ about training",
    execute: "Execute",
    running: "Executing…",
    content: "Edit content",
    items: "Add / edit / delete items",
    tabs: "Open an admin tab",
    done: "Request completed.",
    error: "Could not execute the request.",
  },
  fr: {
    title: "Assistant IA d’administration",
    description: "Décrivez naturellement la modification souhaitée. L’assistant comprend le contenu d’administration et applique directement les changements de données.",
    placeholder: "Exemple : changez le titre du premier service… ou ajoutez une FAQ sur la formation",
    execute: "Exécuter",
    running: "Exécution…",
    content: "Modifier le contenu",
    items: "Ajouter / modifier / supprimer des éléments",
    tabs: "Ouvrir un onglet d’administration",
    done: "Demande exécutée.",
    error: "Impossible d’exécuter la demande.",
  },
};

export function AdminAIAssistant({ onTab }: { onTab: (tab: string) => void }) {
  const { language } = useSiteLanguage();
  const t = copy[language];
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function run() {
    const text = message.trim();
    if (!text || busy) return;
    setBusy(true); setStatus("idle"); setReply("");
    try {
      const res = await adminFetch("/api/admin/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || t.error);
      setReply(data.action?.reply || t.done);
      setStatus("success");
      if (data.action?.type === "open_tab" && data.action.tab) onTab(data.action.tab);
      setMessage("");
    } catch (error) {
      setReply(error instanceof Error ? error.message : t.error);
      setStatus("error");
    } finally { setBusy(false); }
  }

  return (
    <section className="rounded-2xl border border-[#c9b991]/50 bg-white/90 p-5 shadow-sm md:p-7" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#101c2c] text-[#d8bd83]"><Bot size={21} /></span>
        <div><h2 className="font-display text-xl font-bold text-ink-900">{t.title}</h2><p className="mt-1 text-sm leading-6 text-muted">{t.description}</p></div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void run(); }} className="admin-input flex-1" placeholder={t.placeholder} disabled={busy} />
        <button onClick={() => void run()} disabled={busy || !message.trim()} className="btn btn-ink !px-5 !py-2.5 disabled:opacity-50">{busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}{busy ? t.running : t.execute}</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted"><span className="rounded-full bg-[#f3eee3] px-3 py-1.5">{t.content}</span><span className="rounded-full bg-[#f3eee3] px-3 py-1.5">{t.items}</span><span className="rounded-full bg-[#f3eee3] px-3 py-1.5">{t.tabs}</span></div>
      {reply ? <div className={`mt-5 rounded-xl border p-4 text-sm leading-7 ${status === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-900"}`}><div className="flex gap-2"><span className="mt-1 shrink-0">{status === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}</span><p className="whitespace-pre-wrap">{reply}</p></div></div> : null}
    </section>
  );
}
