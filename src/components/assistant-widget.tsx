"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, MessageCircle, Scale, Send, X } from "lucide-react";

const copy = {
  ar: { greeting: "مرحبًا بكم. أنا المساعد الافتراضي لمكتب د. حسام لطفي. يمكنني تزويدكم بالمعلومات المنشورة على الموقع عن المكتب وخدماته والتدريب وبيانات التواصل.", placeholder: "اكتب سؤالك…", suggestions: ["إزاي أقدّم للتدريب؟", "إيه مجالات عمل المكتب؟", "إزاي أتواصل معاكم؟", "معلومات عن الدكتور حسام لطفي"], typing: "يكتب…", title: "المساعد الافتراضي لمكتب د. حسام لطفي", open: "فتح الصفحة" },
  en: { greeting: "Welcome. I am the virtual assistant for Dr. Hossam Loutfi Law Firm. I can provide information published on this website about the firm, its services, training and contact details.", placeholder: "Write your question…", suggestions: ["How do I apply for training?", "What are the firm's practice areas?", "How can I contact the firm?", "Tell me about Dr. Hossam Loutfi"], typing: "Typing…", title: "Dr. Hossam Loutfi Law Firm — Virtual Assistant", open: "Open page" },
  fr: { greeting: "Bienvenue. Je suis l’assistant virtuel du cabinet Dr. Hossam Loutfi. Je peux fournir les informations publiées sur ce site concernant le cabinet, ses services, les stages et les coordonnées.", placeholder: "Écrivez votre question…", suggestions: ["Comment postuler à un stage ?", "Quels sont les domaines du cabinet ?", "Comment contacter le cabinet ?", "Informations sur Dr. Hossam Loutfi"], typing: "Écrit…", title: "Assistant virtuel — Cabinet Dr. Hossam Loutfi", open: "Ouvrir la page" },
} as const;

type Lang = keyof typeof copy;
type Message = { role: "user" | "assistant"; content: string; links?: SiteLink[] };
type SiteLink = { label: string; href: string };

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("ar");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const browser = navigator.language.toLowerCase();
    setLang(browser.startsWith("fr") ? "fr" : browser.startsWith("en") ? "en" : "ar");
  }, []);

  const t = copy[lang];
  const visibleMessages = useMemo(() => (messages.length ? messages : [{ role: "assistant" as const, content: t.greeting }]), [messages, t.greeting]);

  async function sendMessage(value = input) {
    const content = value.trim();
    if (!content || typing) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setTyping(true);
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      setMessages((current) => [...current, { role: "assistant", content: data.answer || t.greeting, links: Array.isArray(data.links) ? data.links : [] }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: lang === "en" ? "The assistant is temporarily unavailable. Please contact the firm directly using the contact details published on the website." : lang === "fr" ? "L’assistant est temporairement indisponible. Veuillez contacter directement le cabinet via les coordonnées publiées sur le site." : "المساعد غير متاح مؤقتًا. يُرجى التواصل مع المكتب مباشرة عبر بيانات الاتصال المنشورة على الموقع." }]);
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
              <div className="min-w-0"><p className="truncate text-sm font-bold">{t.title}</p><p className="text-[11px] opacity-70">{lang === "ar" ? "معلومات الموقع فقط" : lang === "fr" ? "Informations du site uniquement" : "Website information only"}</p></div>
            </div>
            <button type="button" className="assistant-close" aria-label="Close" onClick={() => setOpen(false)}><X size={18} /></button>
          </header>

          <div className="assistant-messages">
            {visibleMessages.map((m, i) => (
              <div key={`${m.role}-${i}`}>
                <div className={m.role === "user" ? "assistant-bubble user" : "assistant-bubble bot"}>{m.content}</div>
                {m.role === "assistant" && m.links?.length ? (
                  <div className="assistant-links">
                    {m.links.map((link) => <a key={`${link.href}-${link.label}`} href={link.href} className="assistant-link"><ArrowUpRight size={15} />{link.label}</a>)}
                  </div>
                ) : null}
              </div>
            ))}
            {messages.length === 0 ? <div className="assistant-suggestions">{t.suggestions.map((s) => <button key={s} type="button" onClick={() => void sendMessage(s)}>{s}</button>)}</div> : null}
            {typing ? <div className="assistant-bubble bot assistant-typing"><span /><span /><span /> {t.typing}</div> : null}
          </div>

          <form className="assistant-form" onSubmit={submit}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} aria-label={t.placeholder} />
            <button type="submit" aria-label="Send" disabled={!input.trim() || typing}><Send size={17} /></button>
          </form>
        </section>
      ) : null}
      <button type="button" className="assistant-fab" aria-label={t.title} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? <X size={22} /> : <MessageCircle size={23} strokeWidth={1.8} />}
      </button>
    </div>
  );
}
