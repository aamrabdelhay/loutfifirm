"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

type Data = { group: { name: string }; sessions: { title: string; date: string; time: string; place: string; notes: string }[]; assignments: { title: string; description: string; dueDate: string }[] };

export function TrainingPortal() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const r = await fetch("/api/training/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "تعذر الدخول");
      setData(d);
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "تعذر الدخول"); } finally { setBusy(false); }
  }
  if (!data) return (
    <form onSubmit={submit} className="card-elegant space-y-4 p-7">
      <label className="field-label" htmlFor="pc">كود المجموعة</label>
      <input id="pc" className="input" dir="ltr" autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} />
      {err ? <p className="text-sm font-bold text-red-600">{err}</p> : null}
      <button className="btn btn-ink" disabled={busy || code.trim().length < 16}>{busy ? <Loader2 className="animate-spin" size={16} /> : null}دخول</button>
    </form>
  );
  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl font-bold text-ink-900">{data.group.name}</h2>
      <div><h3 className="mb-3 font-bold">المحاضرات</h3>{data.sessions.length === 0 ? <p className="text-muted">لا توجد محاضرات مجدولة.</p> : <ul className="space-y-3">{data.sessions.map((s, i) => <li key={i} className="card-elegant p-4"><b>{s.title}</b><div className="text-sm text-muted" dir="ltr">{s.date} {s.time}</div>{s.place ? <div className="text-sm">{s.place}</div> : null}{s.notes ? <div className="text-sm text-muted">{s.notes}</div> : null}</li>)}</ul>}</div>
      <div><h3 className="mb-3 font-bold">التكليفات</h3>{data.assignments.length === 0 ? <p className="text-muted">لا توجد تكليفات.</p> : <ul className="space-y-3">{data.assignments.map((a, i) => <li key={i} className="card-elegant p-4"><b>{a.title}</b>{a.dueDate ? <div className="text-sm text-muted" dir="ltr">{a.dueDate}</div> : null}<p className="mt-1 text-sm leading-7">{a.description}</p></li>)}</ul>}</div>
    </div>
  );
}
