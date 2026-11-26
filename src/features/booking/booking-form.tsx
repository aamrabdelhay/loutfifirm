"use client";
import { getLeadSource } from "@/features/tracking/source";

import { useEffect, useState, type FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useSiteLanguage } from "@/components/site-language";
import { BRANCH_IDS, MODES, MODE_LABELS } from "./config";

type Office = { name: string; lines: string[] };

const COPY = {
  ar: {
    name: "الاسم الكامل", phone: "رقم الهاتف", email: "البريد الإلكتروني", branch: "الفرع", type: "نوع الاستشارة", mode: "طريقة المقابلة",
    notes: "ملاحظات إضافية", notesPh: "اكتب أي تفاصيل تريد أن يعرفها فريق المكتب...", pick: "اختر", submit: "إرسال طلب الموعد",
    okTitle: "تم استلام طلب الموعد", okBody: "سيتواصل معك فريق المكتب لتأكيد الموعد وتفاصيله.", err: "حدث خطأ أثناء إرسال طلب الموعد",
    hint: "سيراجع المكتب طلبك ويؤكد الموعد معك.", date: "التاريخ المفضل", slot: "الأوقات المتاحة", loadingSlots: "جارٍ عرض الأوقات المتاحة...", noSlots: "لا توجد أوقات متاحة في هذا اليوم، اختر يومًا آخر.", slotsHint: "الأوقات أدناه من جدول المكتب. اختيار وقت يحجزه مؤقتًا إلى أن يؤكده المكتب.",
    types: { LEGAL_CONSULTATION: "استشارة قانونية", CASE_FOLLOW_UP: "متابعة ملف", OTHER: "أخرى" },
  },
  en: {
    name: "Full name", phone: "Phone number", email: "Email address", branch: "Branch", type: "Consultation type", mode: "Meeting method",
    notes: "Additional notes", notesPh: "Add any details the office should know...", pick: "Select", submit: "Request an appointment",
    okTitle: "Appointment request received", okBody: "The office will contact you to confirm the appointment and its details.", err: "An error occurred while sending your request",
    hint: "The office will review your request and confirm the appointment with you.", date: "Preferred date", slot: "Available times", loadingSlots: "Loading available times...", noSlots: "No times are available on this day. Please pick another day.", slotsHint: "These times come from the office schedule. Choosing one holds it until the office confirms.",
    types: { LEGAL_CONSULTATION: "Legal consultation", CASE_FOLLOW_UP: "Case follow-up", OTHER: "Other" },
  },
  fr: {
    name: "Nom complet", phone: "Téléphone", email: "E-mail", branch: "Bureau", type: "Type de consultation", mode: "Mode de rencontre",
    notes: "Informations complémentaires", notesPh: "Ajoutez les informations utiles au cabinet...", pick: "Choisir", submit: "Demander un rendez-vous",
    okTitle: "Demande de rendez-vous reçue", okBody: "Le cabinet vous contactera pour confirmer le rendez-vous et ses détails.", err: "Une erreur est survenue lors de l'envoi",
    hint: "Le cabinet examinera votre demande et confirmera le rendez-vous avec vous.", date: "Date souhaitée", slot: "Créneaux disponibles", loadingSlots: "Chargement des créneaux...", noSlots: "Aucun créneau disponible ce jour. Choisissez un autre jour.", slotsHint: "Ces créneaux proviennent de l'agenda du cabinet. En choisir un le réserve jusqu'à confirmation.",
    types: { LEGAL_CONSULTATION: "Consultation juridique", CASE_FOLLOW_UP: "Suivi de dossier", OTHER: "Autre" },
  },
} as const;

export function BookingForm({ offices }: { offices: Office[] }) {
  const { language } = useSiteLanguage();
  const t = COPY[language];
  const branchesKnown = offices.length === BRANCH_IDS.length;
  const [f, setF] = useState({ name: "", phone: "", email: "", branch: "0", type: "", mode: "office", notes: "" });
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [manage, setManage] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotState, setSlotState] = useState<"idle" | "loading" | "ready" | "off">("idle");
  const today = new Date().toISOString().slice(0, 10);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const branchIndex = Number(f.branch);
  const branchLabel = offices[branchIndex]?.name ?? "";
  const branchId = branchesKnown ? BRANCH_IDS[branchIndex] : "branch_main";

  useEffect(() => {
    setTime("");
    if (!date) { setSlotState("idle"); setSlots([]); return; }
    let cancelled = false;
    setSlotState("loading");
    fetch(`/api/availability?date=${date}&branch=${branchId}`)
      .then((r) => r.json())
      .then((d) => { if (cancelled) return; if (d.available) { setSlots(d.slots); setSlotState("ready"); } else { setSlots([]); setSlotState("off"); } })
      .catch(() => { if (!cancelled) { setSlots([]); setSlotState("off"); } });
    return () => { cancelled = true; };
  }, [date, branchId]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("loading"); setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: crypto.randomUUID(),
          name: f.name, phone: f.phone, email: f.email, type: f.type, notes: f.notes,
          mode: f.mode, source: getLeadSource(), date: time ? date : "", time, branchLabel, branchId: branchesKnown ? BRANCH_IDS[branchIndex] : undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || t.err);
      setManage(typeof d.manageUrl === "string" ? d.manageUrl : ""); setState("ok");
    } catch (err) { setError(err instanceof Error ? err.message : t.err); setState("error"); }
  }

  if (state === "ok") return (
    <div className="card-elegant p-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full border border-green-200 bg-green-50 text-green-600"><CheckCircle2 size={32} /></span>
      <h3 className="font-display mt-6 text-2xl font-bold text-ink-900">{t.okTitle}</h3>
      <p className="mt-3 leading-7 text-muted">{t.okBody}</p>
      {manage ? <p className="mt-4 text-sm"><a className="font-bold text-steel-700 underline" href={manage}>{language === "ar" ? "عرض الطلب أو تعديله أو إلغاؤه" : language === "fr" ? "Voir, modifier ou annuler la demande" : "View, change or cancel the request"}</a></p> : null}
    </div>
  );

  return (
    <form onSubmit={submit} className="card-elegant p-7 md:p-9" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="field-label" htmlFor="b-name">{t.name} *</label><input id="b-name" className="input" required value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><label className="field-label" htmlFor="b-phone">{t.phone} *</label><input id="b-phone" className="input" required dir="ltr" inputMode="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        <div><label className="field-label" htmlFor="b-email">{t.email}</label><input id="b-email" type="email" className="input" dir="ltr" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div><label className="field-label" htmlFor="b-type">{t.type} *</label><select id="b-type" className="input" required value={f.type} onChange={(e) => set("type", e.target.value)}><option value="" disabled>{t.pick}</option>{Object.entries(t.types).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        {branchesKnown ? <div><label className="field-label" htmlFor="b-branch">{t.branch} *</label><select id="b-branch" className="input" value={f.branch} onChange={(e) => set("branch", e.target.value)}>{offices.map((o, i) => <option key={o.name} value={i}>{o.name}</option>)}</select></div> : null}
        <div><label className="field-label" htmlFor="b-mode">{t.mode} *</label><select id="b-mode" className="input" value={f.mode} onChange={(e) => set("mode", e.target.value)}>{MODES.map((m) => <option key={m} value={m}>{MODE_LABELS[m][language]}</option>)}</select></div>
      </div>
      <div className="mt-5">
        <label className="field-label" htmlFor="b-date">{t.date}</label>
        <input id="b-date" type="date" min={today} className="input md:max-w-xs" dir="ltr" value={date} onChange={(e) => setDate(e.target.value)} />
        {slotState === "loading" ? <p className="mt-2 text-sm text-muted">{t.loadingSlots}</p> : null}
        {slotState === "ready" ? (
          <div className="mt-3">
            <p className="mb-2 text-sm font-bold text-ink-800">{t.slot}</p>
            {slots.length === 0 ? <p className="text-sm text-muted">{t.noSlots}</p> : (
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.slot}>
                {slots.map((s) => (
                  <button type="button" role="radio" aria-checked={time === s} key={s} onClick={() => setTime(s)} dir="ltr"
                    className={`rounded-lg border px-4 py-2 text-sm font-bold transition-colors ${time === s ? "border-ink-900 bg-ink-900 text-steel-100" : "border-sand bg-white/70 text-ink-800 hover:border-steel-500"}`}>{s}</button>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs leading-6 text-muted">{t.slotsHint}</p>
          </div>
        ) : null}
      </div>
      <p className="mt-5 rounded-xl border border-steel-500/20 bg-steel-500/5 px-4 py-3 text-sm leading-7 text-muted">{t.hint}</p>
      <div className="mt-5"><label className="field-label" htmlFor="b-notes">{t.notes}</label><textarea id="b-notes" className="input min-h-28" maxLength={3500} value={f.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t.notesPh} /></div>
      {state === "error" ? <p className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600"><AlertCircle size={16} />{error}</p> : null}
      <button type="submit" disabled={state === "loading"} className="btn btn-ink mt-6 w-full md:w-auto disabled:opacity-60">{state === "loading" ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}{t.submit}</button>
    </form>
  );
}
