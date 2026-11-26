"use client";

import { useState, type FormEvent } from "react";

export function RegisterForm({ eventId, full }: { eventId: number; full: boolean }) {
  const [f, setF] = useState({ name: "", email: "", phone: "" });
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  if (full) return <p className="font-bold text-red-600">اكتمل العدد</p>;
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg("");
    const r = await fetch("/api/events/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId, ...f }) }).catch(() => null);
    const d = r ? await r.json().catch(() => ({})) : {};
    setBusy(false);
    if (r?.ok && d.ok) { setOk(true); setMsg(d.duplicate ? "أنت مسجل بالفعل في هذه الفعالية." : "تم تسجيلك. سيتواصل معك المكتب بالتفاصيل."); }
    else setMsg(d.error || "تعذر التسجيل");
  }
  if (ok) return <p className="font-bold text-emerald-700">{msg}</p>;
  return (
    <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-4">
      <input className="input" required placeholder="الاسم" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <input className="input" required type="email" dir="ltr" placeholder="البريد" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <input className="input" dir="ltr" placeholder="الهاتف (اختياري)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <button className="btn btn-ink" disabled={busy}>سجل</button>
      {msg ? <p className="text-sm font-bold text-red-600 sm:col-span-4">{msg}</p> : null}
    </form>
  );
}
