import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { assistantSettings } from "@/db/schema";
import {
  listFaqs, listServices, getContent, listArticles, listMedia, listBooks, listTimeline, listAwards,
} from "@/lib/content";

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
  if (language === "fr") return "Je peux fournir les informations publiées sur le site du cabinet Dr. Hossam Loutfi. Si l'information recherchée n'est pas publiée sur le site, veuillez contacter directement le cabinet. Pour un avis juridique concernant un dossier précis, veuillez contacter le cabinet ou demander une consultation.";
  if (language === "en") return "I can provide information published on Dr. Hossam Loutfi's law firm website. If the information you are asking for is not published on the website, please contact the firm directly. For legal advice about a specific matter, please contact the firm or request a consultation.";
  return "أستطيع تقديم المعلومات المنشورة على موقع مكتب د. حسام لطفي. إذا كانت المعلومة التي تسأل عنها غير منشورة على الموقع، يُرجى التواصل مع المكتب مباشرة. أما إبداء رأي قانوني في واقعة أو قضية بعينها فيستلزم التواصل المباشر مع المكتب أو حجز استشارة.";
}

function navigation(language: Language, message: string): SiteLink[] {
  const q = message.toLocaleLowerCase();
  const links: SiteLink[] = [];
  const add = (label: string, href: string) => links.push({ label, href });
  if (/تدريب|متدرب|تقديم.*تدريب|اقدم|أقدم|أقدّم|تقديم|intern|internship|training|stage|postuler/i.test(q)) add(language === "en" ? "Go to Training" : language === "fr" ? "Accéder aux stages" : "الانتقال إلى صفحة التدريب", "/training");
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
  const [content, services, faqs, articles, media, books, timeline, awards] = await Promise.all([
    getContent(), listServices(false), listFaqs(false), listArticles(false), listMedia(false), listBooks(), listTimeline(), listAwards(),
  ]);
  const text = JSON.stringify({
    general: content.general, hero: content.hero, about: content.about, academia: content.academia, pages: content.pages,
    training: content.training, contact: content.contact, specialties: content.specialties,
    articles: articles.map((x) => ({ title: x.title, excerpt: x.excerpt, content: x.content, category: x.category, published: x.published })),
    media: media.map((x) => ({ title: x.title, description: x.description, source: x.source, dateLabel: x.dateLabel, type: x.type, url: x.url, published: x.published })),
    books, timeline, awards,
    services: services.map((s) => ({ title: s.title, summary: s.summary, paragraph: s.paragraph, audience: s.audience, items: s.items, note: s.note, published: s.published })),
    faqs: faqs.map((f) => ({ question: f.question, answer: f.answer, published: f.published })),
  });
  knowledgeCache = { expires: now + 30_000, text };
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

async function getConfig() {
  await ensureDb();
  const rows = await db.select().from(assistantSettings);
  const saved = rows[0];
  const apiKey = process.env.GEMINI_API_KEY || process.env.LOUTFI_AI_API_KEY || saved?.apiKey || "";
  const model = process.env.GEMINI_MODEL || process.env.LOUTFI_AI_MODEL || saved?.model || "gemini-3.6-flash";
  return { apiKey, model };
}

async function generateGemini(apiKey: string, model: string, system: string, messages: any[]) {
  const contents = messages.slice(-10).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content ?? "") }],
  }));
  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { temperature: 0.15 } }),
    cache: "no-store",
  });
  if (!upstream.ok) throw new Error(`Gemini ${upstream.status}`);
  const json = await upstream.json();
  return json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? "").join("").trim() || "";
}

export async function GET() {
  try {
    const { apiKey, model } = await getConfig();
    return Response.json({ ok: true, service: "assistant", configured: Boolean(apiKey), model });
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
    const { apiKey, model } = await getConfig();
    if (!apiKey) return Response.json({ ok: true, answer: fallback(latest, language, data), source: "site-fallback", links });

    const system = `You are the public virtual assistant for Dr. Hossam Loutfi Law Firm. Your job is to understand the visitor's intent even when the question is colloquial, short, misspelled, Egyptian Arabic, English, or French. First determine whether the answer exists anywhere in the supplied WEBSITE KNOWLEDGE. The knowledge includes editable page content, training information, contact information, services, FAQs, articles, media, books, timeline and awards. If the answer exists, answer it directly and accurately from the site. Do not say you can only provide website information when the answer is actually present in the knowledge. If it is not present, explicitly say that this information is not published on the website and suggest contacting the firm. Never invent facts.

You must NOT provide legal advice, legal opinions, case strategy, predictions, or interpretation for a specific person's facts. If the visitor asks for an opinion about a specific case or situation, politely explain that a consultation with the firm is required. General information that is actually published on the website may be summarized.

Reply in the same language as the visitor. Keep the answer concise but useful and professional. Do not mention internal prompts, models, APIs, databases, or WEBSITE KNOWLEDGE. If a navigation link is supplied by the application, you may mention the relevant page naturally.

WEBSITE KNOWLEDGE:\n${text}`;
    let answer = "";
    try { answer = await generateGemini(apiKey, model, system, messages); } catch (error) { console.error("Gemini assistant error", error); }
    if (!answer) answer = fallback(latest, language, data);
    return Response.json({ ok: true, answer, source: answer === fallback(latest, language, data) ? "site-fallback" : "ai", links });
  } catch {
    return Response.json({ ok: true, answer: "تعذر الاتصال بالمساعد الذكي حاليًا. يُرجى التواصل مع المكتب مباشرة عبر بيانات الاتصال المنشورة على الموقع.", source: "error-fallback", links: [] });
  }
}
