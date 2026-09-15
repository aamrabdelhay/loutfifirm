import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { assistantSettings } from "@/db/schema";
import { listFaqs, listServices, getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Language = "ar" | "en" | "fr";
type SiteLink = { label: string; href: string };
let knowledgeCache: { expires: number; text: string } | null = null;

function languageOf(text: string): Language {
  if (/[\u0600-\u06ff]/.test(text)) return "ar";
  if (/\b(le|la|les|des|une|un|pour|avec|cabinet|stage|avocat|comment|postuler)\b/i.test(text)) return "fr";
  return "en";
}

function refusal(language: Language) {
  if (language === "fr") return "Je peux uniquement fournir des informations publiées sur le cabinet Dr. Hossam Loutfi. Pour un avis juridique concernant un dossier précis, veuillez contacter directement le cabinet ou demander une consultation.";
  if (language === "en") return "I can only provide information published on Dr. Hossam Loutfi's law firm website. For legal advice about a specific matter, please contact the firm directly or request a consultation.";
  return "أستطيع فقط تقديم المعلومات المنشورة على موقع مكتب د. حسام لطفي. أما إبداء رأي قانوني في واقعة أو قضية بعينها فيستلزم التواصل المباشر مع المكتب أو حجز استشارة.";
}

function navigation(language: Language, message: string): SiteLink[] {
  const q = message.toLocaleLowerCase();
  const links: SiteLink[] = [];
  const add = (label: string, href: string) => links.push({ label, href });
  if (/تدريب|متدرب|تقديم.*تدريب|اقدم|أقدم|أقدّم|تقديم|intern|internship|training|apply.*(train|intern)|stage|postuler/i.test(q)) add(language === "en" ? "Go to Training" : language === "fr" ? "Accéder aux stages" : "الانتقال إلى صفحة التدريب", "/training");
  if (/خدمات|مجالات|تخصص|practice|services|specialit|domaines/i.test(q)) add(language === "en" ? "View Services" : language === "fr" ? "Voir les services" : "عرض الخدمات ومجالات العمل", "/services");
  if (/تواصل|اتصل|هاتف|موبايل|بريد|ايميل|إيميل|عنوان|contact|phone|email|address|coordonn/i.test(q)) add(language === "en" ? "Contact the Firm" : language === "fr" ? "Contacter le cabinet" : "التواصل مع المكتب", "/contact");
  if (/حسام|الدكتور|دكتور|من هو|نبذة|سيرة|about|doctor|profile|qui est|cabinet/i.test(q)) add(language === "en" ? "About Dr. Hossam Loutfi" : language === "fr" ? "À propos de Dr. Hossam Loutfi" : "نبذة عن د. حسام لطفي", "/about");
  if (/سؤال|اسئلة|أسئلة|faq|frequently|questions|questions fréquentes/i.test(q)) add(language === "en" ? "Open FAQ" : language === "fr" ? "Ouvrir la FAQ" : "فتح الأسئلة الشائعة", "/faq");
  if (/اكاديمي|أكاديمي|academia|academic|enseignement|teaching/i.test(q)) add(language === "en" ? "Academic Profile" : language === "fr" ? "Profil académique" : "الملف الأكاديمي", "/academia");
  return links.slice(0, 2);
}

async function knowledge() {
  const now = Date.now();
  if (knowledgeCache && knowledgeCache.expires > now) return knowledgeCache.text;
  const [content, services, faqs] = await Promise.all([getContent(), listServices(), listFaqs()]);
  const text = JSON.stringify({ general: content.general, hero: content.hero, about: content.about, academia: content.academia, pages: content.pages, training: content.training, contact: content.contact, specialties: content.specialties, services: services.map((s) => ({ title: s.title, summary: s.summary, paragraph: s.paragraph, audience: s.audience, items: s.items, note: s.note })), faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })) });
  knowledgeCache = { expires: now + 60_000, text };
  return text;
}

function fallback(message: string, language: Language, data: any) {
  const lower = message.toLocaleLowerCase();
  const c = data.contact ?? {};
  if (/تدريب|متدرب|تقديم.*تدريب|اقدم|أقدم|أقدّم|intern|internship|stage|training|postuler/.test(lower)) return language === "en" ? `Training information: ${data.training?.intro ?? "Please use the training application section on the website."}` : language === "fr" ? `Informations sur le stage : ${data.training?.intro ?? "Veuillez utiliser la section de candidature du site."}` : `بخصوص التدريب: ${data.training?.intro ?? "يمكنك استخدام قسم التقديم للتدريب المنشور على الموقع."}`;
  if (/تواصل|contact|email|هاتف|phone|اتصل|adresse|عنوان|ايميل|إيميل/.test(lower)) return language === "en" ? `Contact: ${c.email ?? ""} ${c.mobile ?? ""}` : language === "fr" ? `Contact : ${c.email ?? ""} ${c.mobile ?? ""}` : `بيانات التواصل: ${c.email ?? ""} ${c.mobile ?? ""}`;
  if (/خدمات|مجالات|services|specialit|تخصص/.test(lower)) return (data.specialties ?? []).join("، ");
  if (/حسام|الدكتور|doctor|about|qui est|من هو/.test(lower)) return language === "en" ? data.hero?.description : data.about?.lead;
  return refusal(language);
}

export async function GET() {
  try {
    await ensureDb();
    const rows = await db.select().from(assistantSettings);
    const saved = rows[0];
    const configured = Boolean(process.env.LOUTFI_AI_API_KEY || saved?.apiKey);
    return Response.json({ ok: true, service: "assistant", configured, endpointConfigured: Boolean(process.env.LOUTFI_AI_ENDPOINT || saved?.endpoint), model: process.env.LOUTFI_AI_MODEL || saved?.model || "gpt-4o-mini" });
  } catch {
    return Response.json({ ok: false, service: "assistant", error: "Assistant health check failed" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const latest = String(messages.at(-1)?.content ?? "").trim();
    if (!latest) return Response.json({ ok: false, error: "Message is required" }, { status: 400 });
    const language = languageOf(latest);
    const data = JSON.parse(await knowledge());
    const text = await knowledge();
    const links = navigation(language, latest);
    const outsideScope = /weather|bitcoin|stock|politic|football|recipe|joke|game|programming|code|password|hack|medical|diagnos|طقس|بيتكوين|بورصة|سياسة|كرة|وصفة|نكت|برمجة|كود|اختراق|طب|تشخيص/i.test(latest);
    if (outsideScope) return Response.json({ ok: true, answer: refusal(language), source: "scope", links: [] });
    await ensureDb();
    const rows = await db.select().from(assistantSettings);
    const saved = rows[0];
    const apiKey = process.env.LOUTFI_AI_API_KEY || saved?.apiKey || "";
    const endpoint = process.env.LOUTFI_AI_ENDPOINT || saved?.endpoint || "https://api.openai.com/v1/chat/completions";
    const model = process.env.LOUTFI_AI_MODEL || saved?.model || "gpt-4o-mini";
    if (!apiKey) return Response.json({ ok: true, answer: fallback(latest, language, data), source: "site", links });
    const system = `You are the official virtual assistant for Dr. Hossam Loutfi Law Firm. Answer only from the supplied website knowledge. Never invent facts. Never provide legal advice, legal opinions, case strategy, predictions, or interpretation for a specific matter; instead direct the visitor to contact the firm or book a consultation. Reject unrelated topics politely. Reply in the same language as the visitor: Arabic, English, or French. Understand colloquial Arabic and Egyptian Arabic, including spelling variations and short questions. In particular, phrases such as "أقدم ازاي؟", "اقدم ازاي للتدريب؟", "عايز أقدم", "ازاي أقدّم", "أقدّم فين؟" mean the visitor wants to know how to apply for the firm's training/internship and should be answered using the training information in the website knowledge. Do not confuse "أقدم" with "قديم". If a visitor asks how to reach a page or section, explain it briefly and use the navigation button supplied by the application. Keep a formal law-firm tone. If the knowledge does not contain the answer, say that the information is not published on the website and recommend direct contact.\n\nWEBSITE KNOWLEDGE:\n${text}`;
    const upstream = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, temperature: 0.1, messages: [{ role: "system", content: system }, ...messages.slice(-8).map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content ?? "") }))] }), cache: "no-store" });
    if (!upstream.ok) return Response.json({ ok: true, answer: fallback(latest, language, data), source: "site-fallback", links });
    const json = await upstream.json();
    const answer = json?.choices?.[0]?.message?.content;
    if (!answer) return Response.json({ ok: true, answer: fallback(latest, language, data), source: "site-fallback", links });
    return Response.json({ ok: true, answer, source: "ai", links });
  } catch {
    return Response.json({ ok: true, answer: "تعذر الاتصال بالمساعد الذكي حاليًا. يُرجى التواصل مع المكتب مباشرة عبر بيانات الاتصال المنشورة على الموقع.", source: "error-fallback", links: [] });
  }
}
