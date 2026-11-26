"use client";
import { useState } from "react";
import { adminFetch } from "@/app/admin/api-client";

type Row = Record<string, unknown>;

/** Admin: upload a SHORT audio clip (max 4MB) for an existing media item and store the speech-to-text result. Needs STT_API_KEY on the server. */
export function TranscribePanel({ items }: { items: Row[] }) {
  const [id, setId] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(file: File | undefined) {
    if (!id || !file) return;
    setBusy(true); setMsg("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await adminFetch(`/api/admin/media/${encodeURIComponent(id)}/transcribe`, { method: "POST", body: fd });
      const d = await res.json().catch(() => ({}));
      if (res.status === 501) setMsg("التفريغ التلقائي غير مفعّل (لم يتم ضبط مزوّد تحويل الصوت).");
      else if (res.status === 403) setMsg("غير مسموح: يلزم تسجيل دخول بكلمة مرور.");
      else if (!res.ok || !d.ok) setMsg(d.error || "تعذر التفريغ.");
      else setMsg(`تم التفريغ (${d.chars} حرفًا). راجع النص وعدّله قبل النشر، ثم حدّث الصفحة.`);
    } catch { setMsg("تعذر الاتصال."); } finally { setBusy(false); }
  }
  return (
    <div className="mt-6 rounded-xl border border-steel-500/30 bg-white/60 p-4 text-sm" dir="rtl">
      <p className="mb-2 font-bold">تفريغ مقطع صوتي (مقاطع قصيرة، حتى 4 ميجابايت)</p>
      <div className="flex flex-wrap items-center gap-3">
        <select value={id} onChange={(e) => setId(e.target.value)} className="rounded border px-2 py-1">
          <option value="">اختر العنصر</option>
          {items.map((r) => <option key={String(r.id)} value={String(r.id)}>{String(r.title ?? r.id)}</option>)}
        </select>
        <input type="file" accept="audio/*,.mp3,.m4a,.wav,.ogg,.webm" disabled={!id || busy} onChange={(e) => run(e.target.files?.[0])} />
        {busy ? <span>جارٍ التفريغ...</span> : null}
      </div>
      {msg ? <p className="mt-2">{msg}</p> : null}
    </div>
  );
}
