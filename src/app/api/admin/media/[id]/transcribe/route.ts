import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { mediaItems } from "@/db/schema";
import { isStrictAdminRequest } from "@/lib/auth";
import { STT_MAX_BYTES, sttConfigured, transcribe } from "@/features/transcribe/provider";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const AUDIO_EXT = ["mp3", "m4a", "wav", "ogg", "webm", "mp4", "mpeg"];

/** multipart: audio file. Saves the transcript on the media item. Admin only, off until STT_API_KEY is set. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isStrictAdminRequest(req))) return Response.json({ ok: false }, { status: 403 });
  if (!sttConfigured()) return Response.json({ ok: false, error: "التفريغ الصوتي غير مفعّل (STT_API_KEY غير مضبوط)" }, { status: 501 });
  const id = Number((await ctx.params).id);
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!Number.isInteger(id) || !(file instanceof File)) return Response.json({ ok: false, error: "طلب غير صحيح" }, { status: 400 });
  if (file.size === 0 || file.size > STT_MAX_BYTES) return Response.json({ ok: false, error: "الحجم الأقصى 24 ميجابايت" }, { status: 413 });
  if (!AUDIO_EXT.includes(file.name.toLowerCase().split(".").pop() ?? "")) return Response.json({ ok: false, error: "نوع الملف غير مدعوم" }, { status: 400 });
  await ensureDb();
  const item = (await db.select({ id: mediaItems.id }).from(mediaItems).where(eq(mediaItems.id, id)).limit(1))[0];
  if (!item) return Response.json({ ok: false }, { status: 404 });
  try {
    const text = await transcribe(file);
    await db.update(mediaItems).set({ transcript: text }).where(eq(mediaItems.id, id));
    return Response.json({ ok: true, chars: text.length });
  } catch (err) {
    console.error("transcription failed", err);
    return Response.json({ ok: false, error: "تعذر التفريغ" }, { status: 502 });
  }
}
