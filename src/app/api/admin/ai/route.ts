import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { isAdminRequest } from "@/lib/auth";
import { getContent, saveContent, listArticles, listMedia, listBooks, listServices, listFaqs, listTimeline, listAwards } from "@/lib/content";
import { SERVER_ENTITIES, sanitize } from "@/lib/server-entities";
import { eq } from "drizzle-orm";
import { assistantSettings } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Action =
  | { type: "none"; reply: string }
  | { type: "open_tab"; tab: string; reply: string }
  | { type: "content_patch"; path: string; value: unknown; reply: string }
  | { type: "entity_update"; entity: string; id: number; fields: Record<string, unknown>; reply: string }
  | { type: "entity_create"; entity: string; fields: Record<string, unknown>; reply: string }
  | { type: "entity_delete"; entity: string; id: number; reply: string };

function detectLanguage(text: string): "ar" | "en" | "fr" {
  if (/[؀-ۿ]/.test(text)) return "ar";
  const french = /\b(le|la|les|des|une|un|pour|avec|dans|ajouter|modifier|supprimer|changer|question|service|formation|merci|bonjour)\b/i;
  return french.test(text) ? "fr" : "en";
}

function setByPath(root: any, path: string, value: unknown) {
  const parts = path.split(".").map((x) => x.trim()).filter(Boolean);
  if (!parts.length || parts.length > 8) throw new Error("Invalid content path");
  let target = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) target[key] = {};
    target = target[key];
  }
  target[parts.at(-1)!] = value;
}

async function adminKnowledge() {
  const [content, articles, media, books, services, faqs, timeline, awards] = await Promise.all([
    getContent(), listArticles(false), listMedia(false), listBooks(), listServices(false), listFaqs(false), listTimeline(), listAwards(),
  ]);
  return { content, articles, media, books, services, faqs, timeline, awards };
}

async function config() {
  await ensureDb();
  const rows = await db.select().from(assistantSettings);
  const row = rows[0];
  return {
    key: process.env.GEMINI_API_KEY || process.env.LOUTFI_AI_API_KEY || row?.apiKey || "",
    model: process.env.GEMINI_MODEL || process.env.LOUTFI_AI_MODEL || row?.model || "gemini-3.6-flash",
  };
}

async function askGemini(apiKey: string, model: string, prompt: string) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.05, responseMimeType: "application/json" } }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const json = await res.json();
  const raw = json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? "").join("").trim();
  if (!raw) throw new Error("Empty Gemini response");
  return JSON.parse(raw) as Action;
}

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) return Response.json({ ok: false }, { status: 401 });
  try {
    const body = await req.json();
    const message = String(body?.message ?? "").trim();
    if (!message) return Response.json({ ok: false, error: "Message is required" }, { status: 400 });
    const responseLanguage = detectLanguage(message);
    const languageName = responseLanguage === "ar" ? "Arabic" : responseLanguage === "fr" ? "French" : "English";
    const { key, model } = await config();
    if (!key) return Response.json({ ok: false, error: responseLanguage === "ar" ? "لم يتم إعداد GEMINI_API_KEY للمساعد الإداري بعد." : responseLanguage === "fr" ? "La clé GEMINI_API_KEY n’est pas encore configurée pour l’assistant d’administration." : "GEMINI_API_KEY is not configured for the admin assistant yet." }, { status: 503 });

    const data = await adminKnowledge();
    const prompt = `You are the admin operations assistant for a law-firm website. Understand Egyptian Arabic colloquial language, English and French. The administrator wants you to HELP AND EXECUTE changes inside the existing admin-managed website data. You may ONLY modify the site content and the listed CRUD entities. Never modify authentication, passwords, API keys, environment variables, code, deployment settings, or database schema.

The administrator's request is written in ${languageName}. Write the action.reply in the SAME LANGUAGE as the administrator's request. Do not switch languages just because the website UI is in another language.

Return ONLY valid JSON matching exactly one of these shapes:
{"type":"none","reply":"..."}
{"type":"open_tab","tab":"dashboard|content|articles|media|books|services|faqs|timeline|awards|applications|messages|settings","reply":"..."}
{"type":"content_patch","path":"dot.separated.path","value":...,"reply":"..."}
{"type":"entity_update","entity":"articles|media|books|services|faqs|timeline|awards|applications|messages","id":123,"fields":{...},"reply":"..."}
{"type":"entity_create","entity":"articles|media|books|services|faqs|timeline|awards","fields":{...},"reply":"..."}
{"type":"entity_delete","entity":"articles|media|books|services|faqs|timeline|awards|applications|messages","id":123,"reply":"..."}

For content_patch, use an existing object path from content; never invent a database entity path. For entity actions, use an existing entity and field names. If the user asks for a change that is ambiguous, dangerous, or cannot be mapped confidently to one action, return type none and explain what is needed. When asked to edit text, perform the edit rather than merely explaining how.

Current admin data:\n${JSON.stringify(data)}\n\nAdministrator request:\n${message}`;

    const action = await askGemini(key, model, prompt);
    if (!action || typeof action !== "object" || typeof action.type !== "string") throw new Error("Invalid action");
    if (action.type === "none" || action.type === "open_tab") return Response.json({ ok: true, action });

    if (action.type === "content_patch") {
      const content = await getContent();
      setByPath(content as any, action.path, action.value);
      await saveContent(content);
      return Response.json({ ok: true, action, executed: true });
    }

    if (!(action.entity in SERVER_ENTITIES)) throw new Error("Unsupported entity");
    const def = SERVER_ENTITIES[action.entity];
    if (action.type === "entity_create") {
      const fields = sanitize(def, action.fields ?? {});
      const rows = (await db.insert(def.table).values(fields).returning()) as unknown as Record<string, unknown>[];
      return Response.json({ ok: true, action, executed: true, row: rows[0] ?? null });
    }
    if (action.type === "entity_update") {
      if (!Number.isFinite(Number(action.id))) throw new Error("Invalid id");
      const fields = sanitize(def, action.fields ?? {});
      const rows = (await db.update(def.table).set(fields).where(eq(def.idColumn, Number(action.id))).returning()) as unknown as Record<string, unknown>[];
      return Response.json({ ok: true, action, executed: true, row: rows[0] ?? null });
    }
    if (action.type === "entity_delete") {
      if (!Number.isFinite(Number(action.id))) throw new Error("Invalid id");
      await db.delete(def.table).where(eq(def.idColumn, Number(action.id)));
      return Response.json({ ok: true, action, executed: true });
    }
    throw new Error("Unsupported action");
  } catch (error) {
    console.error("Admin AI error", error);
    return Response.json({ ok: false, error: "تعذر تنفيذ طلب المساعد الإداري. تأكد من إعداد Gemini API ثم جرّب مرة أخرى." }, { status: 500 });
  }
}
