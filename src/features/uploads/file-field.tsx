"use client";

import { useEffect, useState } from "react";

type Item = { id: string; name: string };

/** Shows nothing unless the server has uploads enabled. Calls onChange with the uploaded ids. */
export function FileField({ kind, max, label, onChange }: { kind: "intake" | "cv"; max: number; label: string; onChange: (ids: string[]) => void }) {
  const [enabled, setEnabled] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/uploads").then((r) => r.json()).then((d) => setEnabled(!!d.enabled)).catch(() => setEnabled(false)); }, []);
  if (!enabled) return null;
  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setErr("");
    const next = [...items];
    for (const f of Array.from(files)) {
      if (next.length >= max) break;
      const fd = new FormData(); fd.set("file", f); fd.set("kind", kind);
      const r = await fetch("/api/uploads", { method: "POST", body: fd }).catch(() => null);
      const d = r ? await r.json().catch(() => ({})) : {};
      if (r?.ok && d.ok) next.push({ id: d.id, name: d.name }); else { setErr(d.error || "تعذر رفع الملف"); break; }
    }
    setItems(next); onChange(next.map((x) => x.id)); setBusy(false);
  }
  return (
    <div className="mt-5">
      <label className="field-label" htmlFor={`f-${kind}`}>{label}</label>
      <input id={`f-${kind}`} type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" multiple={max > 1} disabled={busy || items.length >= max} onChange={(e) => pick(e.target.files)} className="input" />
      <p className="mt-1 text-xs text-muted">PDF أو JPG أو PNG أو DOCX، حتى 4 ميجابايت للملف. لا تُرسل ملفات سرية قبل التواصل مع المكتب.</p>
      {items.map((i) => <div key={i.id} className="text-sm">{i.name}</div>)}
      {err ? <p className="text-sm font-bold text-red-600">{err}</p> : null}
    </div>
  );
}
