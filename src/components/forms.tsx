"use client";

import { useState, type FormEvent } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  GraduationCap,
} from "lucide-react";
import { YEAR_OPTIONS } from "@/lib/nav";
import { useSiteLanguage } from "@/components/site-language";

type SubmitState = "idle" | "loading" | "success" | "error";

/* ------------------------------------------------------------------ */
/*  Training form                                                      */
/* ------------------------------------------------------------------ */
export function TrainingForm({ successMessage }: { successMessage: string }) {
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [experiences, setExperiences] = useState<string[]>([""]);
  const [reason, setReason] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  const updateExp = (i: number, v: string) =>
    setExperiences((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  const addExp = () => setExperiences((prev) => [...prev, ""]);
  const removeExp = (i: number) =>
    setExperiences((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          university,
          year,
          phone,
          email,
          linkedin,
          experiences: experiences.filter((x) => x.trim()),
          reason,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "error");
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الإرسال");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="card-elegant p-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-50 border border-green-200 text-green-600">
          <CheckCircle2 size={32} />
        </span>
        <h3 className="font-display mt-6 text-2xl font-bold text-ink-900">تم الإرسال بنجاح</h3>
        <p className="mt-3 text-muted leading-7">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-elegant p-7 md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="t-name">الاسم <span className="text-steel-600">*</span></label>
          <input id="t-name" className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
        </div>
        <div>
          <label className="field-label" htmlFor="t-univ">الجامعة <span className="text-steel-600">*</span></label>
          <input id="t-univ" className="input" required value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="مثال: كلية الحقوق — جامعة القاهرة" />
        </div>
        <div>
          <label className="field-label" htmlFor="t-year">الفرقة <span className="text-steel-600">*</span></label>
          <select id="t-year" className="input" required value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="" disabled>اختر الفرقة</option>
            {YEAR_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="t-phone">رقم التليفون <span className="text-steel-600">*</span></label>
          <input id="t-phone" className="input" required dir="ltr" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
        </div>
        <div>
          <label className="field-label" htmlFor="t-email">الميل (البريد الإلكتروني) <span className="text-steel-600">*</span></label>
          <input id="t-email" type="email" className="input" required dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
        </div>
        <div>
          <label className="field-label" htmlFor="t-linkedin">لينك LinkedIn <span className="text-muted font-normal text-xs">(اختياري)</span></label>
          <input id="t-linkedin" className="input" dir="ltr" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
        </div>
      </div>

      {/* Experiences */}
      <div className="mt-7">
        <span className="field-label">الخبرات السابقة والتدريبات</span>
        <div className="space-y-3">
          {experiences.map((exp, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="input"
                value={exp}
                onChange={(e) => updateExp(i, e.target.value)}
                placeholder={`خبرة / تدريب ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeExp(i)}
                className="grid size-11 shrink-0 place-items-center rounded-lg border border-red-200 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="حذف"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addExp}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-steel-500/60 px-4 py-2.5 text-sm font-bold text-steel-700 transition-colors hover:bg-steel-500/10"
        >
          <Plus size={16} />
          أضف خبرة / تدريب آخر
        </button>
      </div>

      <div className="mt-7">
        <label className="field-label" htmlFor="t-reason">عايز تتدرب ليه؟ <span className="text-steel-600">*</span></label>
        <textarea id="t-reason" className="input min-h-32" required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="اكتب دوافعك للانضمام لبرنامج التدريب وماذا تتوقع منه..." />
      </div>

      {state === "error" ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600">
          <AlertCircle size={16} /> {error}
        </p>
      ) : null}

      <button type="submit" disabled={state === "loading"} className="btn btn-ink mt-7 w-full md:w-auto disabled:opacity-60">
        {state === "loading" ? <Loader2 size={18} className="animate-spin" /> : <GraduationCap size={18} />}
        إرسال طلب التدريب
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact form                                                       */
/* ------------------------------------------------------------------ */
export function ContactForm() {
  const { language } = useSiteLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  const copy = {
    ar: {
      name: "الاسم الكامل", phone: "رقم الهاتف", email: "البريد الإلكتروني", date: "التاريخ", time: "الوقت",
      type: "نوع الموعد", notes: "ملاحظات إضافية", namePlaceholder: "الاسم الكامل", typePlaceholder: "اختر نوع الموعد",
      notesPlaceholder: "اكتب أي تفاصيل تريد أن يعرفها فريق المكتب...", submit: "تأكيد حجز الموعد",
      successTitle: "تم استلام طلب الموعد", successBody: "سيتواصل معك فريق المكتب لتأكيد الموعد وتفاصيله.",
      error: "حدث خطأ أثناء حجز الموعد", required: "*", selectRequired: "يرجى اختيار نوع الموعد",
      types: ["استشارة قانونية", "اجتماع مع المكتب", "متابعة ملف", "أخرى"],
    },
    en: {
      name: "Full name", phone: "Phone number", email: "Email address", date: "Date", time: "Time",
      type: "Appointment type", notes: "Additional notes", namePlaceholder: "Full name", typePlaceholder: "Select appointment type",
      notesPlaceholder: "Add any details the office should know...", submit: "Confirm appointment",
      successTitle: "Appointment request received", successBody: "The office team will contact you to confirm the appointment and its details.",
      error: "An error occurred while booking the appointment", required: "*", selectRequired: "Please select an appointment type",
      types: ["Legal consultation", "Meeting with the office", "Case follow-up", "Other"],
    },
    fr: {
      name: "Nom complet", phone: "Numéro de téléphone", email: "E-mail", date: "Date", time: "Heure",
      type: "Type de rendez-vous", notes: "Informations complémentaires", namePlaceholder: "Nom complet", typePlaceholder: "Choisissez le type de rendez-vous",
      notesPlaceholder: "Ajoutez les informations utiles au cabinet...", submit: "Confirmer le rendez-vous",
      successTitle: "Demande de rendez-vous reçue", successBody: "L'équipe du cabinet vous contactera pour confirmer le rendez-vous et ses détails.",
      error: "Une erreur est survenue lors de la réservation", required: "*", selectRequired: "Veuillez choisir un type de rendez-vous",
      types: ["Consultation juridique", "Réunion avec le cabinet", "Suivi de dossier", "Autre"],
    },
  }[language];

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!type) {
      setError(copy.selectRequired);
      setState("error");
      return;
    }
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: crypto.randomUUID(),
          name,
          phone,
          email,
          date,
          time,
          type,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || copy.error);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.error);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="card-elegant p-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-green-200 bg-green-50 text-green-600">
          <CheckCircle2 size={32} />
        </span>
        <h3 className="font-display mt-6 text-2xl font-bold text-ink-900">{copy.successTitle}</h3>
        <p className="mt-3 text-muted leading-7">{copy.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-elegant p-7 md:p-9" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="c-name">{copy.name} <span className="text-steel-600">{copy.required}</span></label>
          <input id="c-name" className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder={copy.namePlaceholder} />
        </div>
        <div>
          <label className="field-label" htmlFor="c-phone">{copy.phone} <span className="text-steel-600">{copy.required}</span></label>
          <input id="c-phone" className="input" required dir="ltr" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="c-email">{copy.email}</label>
          <input id="c-email" type="email" className="input" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="c-date">{copy.date} <span className="text-steel-600">{copy.required}</span></label>
          <input id="c-date" type="date" className="input" required min={minDate} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="c-time">{copy.time} <span className="text-steel-600">{copy.required}</span></label>
          <input id="c-time" type="time" className="input" required value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="c-type">{copy.type} <span className="text-steel-600">{copy.required}</span></label>
          <select id="c-type" className="input" required value={type} onChange={(e) => setType(e.target.value)}>
            <option value="" disabled>{copy.typePlaceholder}</option>
            {copy.types.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <label className="field-label" htmlFor="c-notes">{copy.notes}</label>
        <textarea id="c-notes" className="input min-h-32" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={copy.notesPlaceholder} />
      </div>
      {state === "error" ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600">
          <AlertCircle size={16} /> {error}
        </p>
      ) : null}
      <button type="submit" disabled={state === "loading"} className="btn btn-ink mt-6 w-full md:w-auto disabled:opacity-60">
        {state === "loading" ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
        {copy.submit}
      </button>
    </form>
  );
}
