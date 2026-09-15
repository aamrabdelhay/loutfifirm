import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { assistantSettings } from "@/db/schema";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

function mask(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "••••••••";
  return `${value.slice(0, 3)}${"•".repeat(Math.max(4, Math.min(12, value.length - 7)))}${value.slice(-4)}`;
}

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) return Response.json({ ok: false }, { status: 401 });
  await ensureDb();
  const rows = await db.select().from(assistantSettings);
  const row = rows[0];
  const envConfigured = Boolean(process.env.LOUTFI_AI_API_KEY);
  return Response.json({ ok: true, configured: Boolean(row?.apiKey) || envConfigured, source: envConfigured ? "environment" : row?.apiKey ? "admin" : "none", maskedKey: envConfigured ? mask(process.env.LOUTFI_AI_API_KEY!) : mask(row?.apiKey ?? ""), model: process.env.LOUTFI_AI_MODEL || row?.model || "gpt-4o-mini", endpoint: process.env.LOUTFI_AI_ENDPOINT || row?.endpoint || "https://api.openai.com/v1/chat/completions" });
}

export async function PUT(req: Request) {
  if (!(await isAdminRequest(req))) return Response.json({ ok: false }, { status: 401 });
  const body = await req.json();
  const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
  const model = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : "gpt-4o-mini";
  const endpoint = typeof body?.endpoint === "string" && body.endpoint.trim() ? body.endpoint.trim() : "https://api.openai.com/v1/chat/completions";
  await ensureDb();
  await db.insert(assistantSettings).values({ id: 1, apiKey, model, endpoint }).onConflictDoUpdate({ target: assistantSettings.id, set: { apiKey, model, endpoint, updatedAt: new Date() } });
  return Response.json({ ok: true, configured: Boolean(apiKey), maskedKey: mask(apiKey), model, endpoint });
}
