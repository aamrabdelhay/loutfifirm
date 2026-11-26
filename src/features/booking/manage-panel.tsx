"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, CalendarX2, CalendarClock, AlertCircle, CheckCircle2 } from "lucide-react";

type Appt = { branchId?: string | null; status: string; date: string | null; time: string | null; type: string | null; branch: string | null };

const STATUS: Record<string, string> = {
  PENDING: "قيد المراجعة من المكتب",
  CONFIRMED: "مؤكد",
  CANCELLED: "ملغي",
};

export function ManagePanel({ id, token }: { id: string; token: string }) {
  const [appt, setAppt] = useState<Appt | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "invalid" | "unavailable">("loading");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/appointments/manage?id=${id}&t=${encodeURIComponent(token)}`);
      if (r.status === 403) return setState("invalid");
      const d = await r.json();
      if (!d.ok) return setState("unavailable");
      setAppt(d.appointment); setState("ready");
    } catch { setState("unavailable"); }
  }, [id, token]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    setTime(""); setSlots(null);
    if (!date) return;
    fetch(`/api/availability?date=${date}&branch=${appt?.branchId ?? "branch_main"}`).then((r) => r.json()).then((d) => setSlots(d.available ? d.slots : null)).catch(() => setSlots(null));
  }, [date, appt?.branchId]);

  async function act(action: "cancel" | "reschedule") {
    if (action === "cancel" && !confirm("هل تريد إلغاء هذا الطلب؟")) return;
    setBusy(true); setMsg("");
    try {
      const r = await fetch("/api/appointments/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, t: token, action, date: date || undefined, time: time || undefined, note: note || undefined }) });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error || "تعذر تنفيذ الطلب");
      setMsg(action === "cancel" ? "تم إلغاء الطلب." : "تم إرسال طلب تعديل الموعد، وسيؤكده المكتب.");
      await load();
    } catch (e) { setMsg(e instanceof Error ? e.message : "تعذر تنفيذ الطلب"); } finally { setBusy(false); }
  }

  if (state === "loading") return <Loader2 className="mx-auto animate-spin text-steel-600" />;
  if (state === "invalid") return <p className="card-elegant p-8 text-center text-red-600">الرابط غير صالح.</p>;
  if (state === "unavailable" || !appt) return <p className="card-elegant p-8 text-center text-muted">تعذر عرض الطلب حاليًا. يرجى التواصل مع المكتب.</p>;
  const cancelled = appt.status === "CANCELLED";
  return (
    <div className="card-elegant space-y-5 p-7 md:p-9">
      <dl className="grid gap-3 text-sm md:grid-cols-2">
        <div><dt className="text-xs text-muted">الحالة</dt><dd className="font-bold text-ink-900">{STATUS[appt.status] ?? appt.status}</dd></div>
        <div><dt className="text-xs text-muted">الفرع</dt><dd className="font-bold text-ink-900">{appt.branch ?? "—"}</dd></div>
        <div><dt className="text-xs text-muted">التاريخ</dt><dd className="font-bold text-ink-900" dir="ltr">{appt.date ?? "يحدده المكتب"}</dd></div>
        <div><dt className="text-xs text-muted">الوقت</dt><dd className="font-bold text-ink-900" dir="ltr">{appt.time ?? "يحدده المكتب"}</dd></div>
      </dl>
      {cancelled ? <p className="flex items-center gap-2 text-sm text-muted"><CheckCircle2 size={16} />هذا الطلب ملغي.</p> : (
        <>
          <div className="space-y-3 border-t border-sand pt-5">
            <h3 className="font-display text-lg font-bold">طلب تعديل الموعد</h3>
            <input type="date" dir="ltr" className="input md:max-w-xs" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
            {slots ? <div className="flex flex-wrap gap-2">{slots.length === 0 ? <span className="text-sm text-muted">لا توجد أوقات متاحة هذا اليوم.</span> : slots.map((s) => <button key={s} type="button" dir="ltr" onClick={() => setTime(s)} className={`rounded-lg border px-4 py-2 text-sm font-bold ${time === s ? "border-ink-900 bg-ink-900 text-steel-100" : "border-sand bg-white/70"}`}>{s}</button>)}</div> : null}
            <textarea className="input min-h-20" maxLength={500} placeholder="ملاحظة للمكتب (اختياري)" value={note} onChange={(e) => setNote(e.target.value)} />
            <button disabled={busy || !date || (slots !== null && !time)} onClick={() => act("reschedule")} className="btn btn-ink !px-5 !py-2.5 !text-sm disabled:opacity-50"><CalendarClock size={16} />إرسال طلب التعديل</button>
          </div>
          <div className="border-t border-sand pt-5"><button disabled={busy} onClick={() => act("cancel")} className="btn btn-outline-ink !px-5 !py-2.5 !text-sm disabled:opacity-50"><CalendarX2 size={16} />إلغاء الطلب</button></div>
        </>
      )}
      {msg ? <p className="flex items-center gap-2 text-sm font-bold text-ink-800"><AlertCircle size={15} />{msg}</p> : null}
    </div>
  );
}
