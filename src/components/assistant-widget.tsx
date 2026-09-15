"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, MessageCircle, Scale, Send, X } from "lucide-react";
import { useSiteLanguage, type SiteLanguage } from "@/components/site-language";

const copy = {
  ar: {
    greeting: "مرحبًا بكم. أنا المساعد الافتراضي لمكتب د. حسام لطفي. يمكنني تزويدكم بالمعلومات المنشورة على الموقع عن المكتب وخدماته والتدريب وبيانات التواصل.",
    placeholder: "اكتب سؤالك…",
    suggestions: ["إزاي أقدّم للتدريب؟", "إيه مجالات عمل المكتب؟", "إزاي أتواصل معاكم؟", "معلومات عن الدكتور حسام لطفي"],
    typing: "يكتب…",
    title: "المساعد الافتراضي لمكتب د. حسام لطفي",
    websiteOnly: "معلومات الموقع فقط",
    close: "إغلاق",
    send: "إرسال",
    fallback: "المساعد غير متاح مؤقتًا. يُرجى التواصل مع المكتب مباشرة عبر بيانات الاتصال المنشورة على الموقع.",
  },
  en: {
    greeting: "Welcome. I am the virtual assistant for Dr. Hossam Loutfi Law Firm. I can provide information published on this website about the firm, its services, training and contact details.",
    placeholder: "Write your question…",
    suggestions: ["How do I apply for training?", "What are the firm's practice areas?", "How can I contact the firm?", "Tell me about Dr. Hossam Loutfi"],
    typing: "Typing…",
    title: "Dr. Hossam Loutfi Law Firm — Virtual Assistant",
    websiteOnly: "Website information only",
    close: "Close",
    send: "Send",
    fallback: "The assistant is temporarily unavailable. Please contact the firm directly using the contact details published on the website.",
  },
  fr: {
    greeting: "Bienvenue. Je suis l’assistant virtuel du cabinet Dr. Hossam Loutfi. Je peux fournir les informations publiées sur ce site concernant le cabinet, ses services, les stages et les coordonnées.",
    placeholder: "Écrivez votre question…",
    suggestions: ["Comment postuler à un stage ?", "Quels sont les domaines du cabinet ?", "Comment contacter le cabinet ?", "Informations sur Dr Hossam Loutfi"],
    typing: "Écrit…",
    title: "Assistant virtuel — Cabinet Dr. Hossam Loutfi",
    websiteOnly: "Informations du site uniquement",
    close: "Fermer",
    send: "Envoyer",
    fallback: "L’assistant est temporairement indisponible. Veuillez contacter directement le cabinet via les coordonnées publiées sur le site.",
  },
} as const;

type SiteLink = { label: string; href: string };
type Message = { role: "user" | "assistant"; content: string; links?: SiteLink[] };

export function AssistantWidget() {
  const { language } = useSiteLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const lang: SiteLanguage = language;
  const t = copy[lang];

  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [language]);

  const visibleMessages = useMemo(
    () => (messages.length ? messages : [{ role: "assistant" as const, content: t.greeting }]),
    [messages, t.greeting]
  );

  async function sendMessage(value = input) {
    const content = value.trim();
    if (!content || typing) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, siteLanguage: language }),
      });
      const data = await res.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer || t.greeting,
          links: Array.isArray(data.links) ? data.links : [],
        },
      ]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: t.fallback }]);
    } finally {
      setTyping(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void sendMessage();
  }

  return (
    <div className="assistant-widget" dir={lang === "ar" ? "rtl" : "ltr"}>
      {open ? (
        <section className="assistant-window" aria-label={t.title}>
          <header className="assistant-header">
            <div className="flex min-w-0 items-center gap-3">
              <span className="assistant-logo"><Scale size={20} strokeWidth={1.7} /></span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{t.title}</p>
                <p className="text-[11px] opacity-70">{t.websiteOnly}</p>
              </div>
            </div>
            <button type="button" className="assistant-close" aria-label={t.close} onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </header>

          <div className="assistant-messages">
            {visibleMessages.map((m, i) => (
              <div key={`${m.role}-${i}`}>
                <div className={m.role === "user" ? "assistant-bubble user" : "assistant-bubble bot"}>{m.content}</div>
                {m.role === "assistant" && m.links?.length ? (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {m.links.map((link) => (
                      <a key={`${link.href}-${link.label}`} href={link.href} className="inline-flex items-center gap-1.5 rounded-full border border-[#d5d3cc] bg-white px-3 py-1.5 text-xs font-semibold text-[#263242] transition hover:border-[#9f8a58] hover:bg-[#faf8f0]">
                        {link.label}
                        <ArrowUpRight size={14} />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {messages.length === 0 ? (
              <div className="assistant-suggestions">
                {t.suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => void sendMessage(s)}>{s}</button>
                ))}
              </div>
            ) : null}
            {typing ? <div className="assistant-bubble bot assistant-typing"><span /><span /><span /> {t.typing}</div> : null}
          </div>

          <form className="assistant-form" onSubmit={submit}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} aria-label={t.placeholder} />
            <button type="submit" aria-label={t.send} disabled={!input.trim() || typing}><Send size={17} /></button>
          </form>
        </section>
      ) : null}
      <button type="button" className="assistant-fab" aria-label={t.title} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? <X size={22} /> : <MessageCircle size={23} strokeWidth={1.8} />}
      </button>
    </div>
  );
}
