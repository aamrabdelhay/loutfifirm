"use client";
import { FileField } from "@/features/uploads/file-field";
import { getLeadSource } from "@/features/tracking/source";

import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { useSiteLanguage } from "@/components/site-language";
import { CASE_TYPES, URGENCY } from "./config";

const COPY = {
  ar: { name: "الاسم الكامل", phone: "رقم الهاتف", email: "البريد الإلكتروني (اختياري)", method: "وسيلة التواصل المفضلة", phoneM: "اتصال", wa: "واتساب", emailM: "بريد إلكتروني", type: "نوع الموضوع", pick: "اختر", urgency: "درجة الاستعجال", deadline: "تاريخ أقرب جلسة أو ميعاد (إن وُجد)", summary: "ملخص الموضوع", summaryHint: "اكتب باختصار ما حدث وما تطلبه (20 حرفًا على الأقل). لا ترسل بيانات سرية جدًا في هذه المرحلة.", docs: "المستندات المتوفرة لديك", docsHint: "حدد ما لديك الآن، وسيطلب المكتب الباقي عند الحاجة.", consent: "أوافق على استخدام بياناتي للرد على طلبي من مكتب المحاماة.", submit: "إرسال الطلب", okTitle: "تم استلام طلبك", okBody: "سيراجع فريق المكتب البيانات ويتواصل معك. إرسال الطلب لا يُنشئ علاقة توكيل أو استشارة قانونية قبل تأكيد المكتب.", err: "تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى." },
  en: { name: "Full name", phone: "Phone number", email: "Email (optional)", method: "Preferred contact method", phoneM: "Phone call", wa: "WhatsApp", emailM: "Email", type: "Matter type", pick: "Select", urgency: "Urgency", deadline: "Date of nearest hearing or deadline (if any)", summary: "Summary of the matter", summaryHint: "Briefly say what happened and what you need (at least 20 characters). Please do not send highly confidential details at this stage.", docs: "Documents you have", docsHint: "Tick what you have now; the office will ask for the rest if needed.", consent: "I agree that the firm may use my details to respond to this request.", submit: "Send request", okTitle: "Your request was received", okBody: "The office will review it and contact you. Sending this form does not create a retainer or legal advice before the firm confirms.", err: "The request could not be sent. Please check the details and try again." },
  fr: { name: "Nom complet", phone: "Téléphone", email: "E-mail (facultatif)", method: "Mode de contact préféré", phoneM: "Appel", wa: "WhatsApp", emailM: "E-mail", type: "Type d'affaire", pick: "Choisir", urgency: "Urgence", deadline: "Date de la prochaine audience ou échéance (le cas échéant)", summary: "Résumé de l'affaire", summaryHint: "Indiquez brièvement les faits et votre demande (20 caractères minimum). N'envoyez pas d'informations très confidentielles à ce stade.", docs: "Documents dont vous disposez", docsHint: "Cochez ce que vous avez; le cabinet demandera le reste si nécessaire.", consent: "J'accepte que le cabinet utilise mes données pour répondre à cette demande.", submit: "Envoyer la demande", okTitle: "Votre demande a été reçue", okBody: "Le cabinet l'examinera et vous contactera. L'envoi de ce formulaire ne crée ni mandat ni conseil juridique avant confirmation du cabinet.", err: "La demande n'a pas pu être envoyée. Vérifiez les informations et réessayez." },
} as const;

export function IntakeForm() {
  const { language } = useSiteLanguage();
  const t = COPY[language];
  const [f, setF] = useState({ name: "", phone: "", email: "", contactMethod: "phone", caseType: "", urgency: "normal", deadlineDate: "", summary: "", consent: false, website: "" });
  const [docs, setDocs] = useState<string[]>([]);
  const [attachmentIds, setAttachmentIds] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const set = (k: string, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));
  const type = CASE_TYPES.find((c) => c.value === f.caseType);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, documents: docs, source: getLeadSource(), attachmentIds }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error();
      setState("ok");
    } catch { setState("error"); }
  }

  if (state === "ok") return (
    <div className="card-elegant p-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full border border-green-200 bg-green-50 text-green-600"><CheckCircle2 size={32} /></span>
      <h3 className="font-display mt-6 text-2xl font-bold text-ink-900">{t.okTitle}</h3>
      <p className="mt-3 leading-7 text-muted">{t.okBody}</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="card-elegant p-7 md:p-9" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label className="field-label" htmlFor="i-name">{t.name} *</label><input id="i-name" className="input" required value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><label className="field-label" htmlFor="i-phone">{t.phone} *</label><input id="i-phone" className="input" required dir="ltr" inputMode="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
        <div><label className="field-label" htmlFor="i-email">{t.email}</label><input id="i-email" type="email" className="input" dir="ltr" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div><label className="field-label" htmlFor="i-method">{t.method}</label><select id="i-method" className="input" value={f.contactMethod} onChange={(e) => set("contactMethod", e.target.value)}><option value="phone">{t.phoneM}</option><option value="whatsapp">{t.wa}</option><option value="email">{t.emailM}</option></select></div>
        <div><label className="field-label" htmlFor="i-type">{t.type} *</label><select id="i-type" className="input" required value={f.caseType} onChange={(e) => { set("caseType", e.target.value); setDocs([]); }}><option value="" disabled>{t.pick}</option>{CASE_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label[language]}</option>)}</select></div>
        <div><label className="field-label" htmlFor="i-urg">{t.urgency} *</label><select id="i-urg" className="input" value={f.urgency} onChange={(e) => set("urgency", e.target.value)}>{URGENCY.map((u) => <option key={u.value} value={u.value}>{u.label[language]}</option>)}</select></div>
        {f.urgency !== "normal" ? <div className="md:col-span-2"><label className="field-label" htmlFor="i-dl">{t.deadline}</label><input id="i-dl" type="date" className="input" dir="ltr" value={f.deadlineDate} onChange={(e) => set("deadlineDate", e.target.value)} /></div> : null}
      </div>
      <div className="mt-5"><label className="field-label" htmlFor="i-sum">{t.summary} *</label><textarea id="i-sum" className="input min-h-36" required minLength={20} maxLength={4000} value={f.summary} onChange={(e) => set("summary", e.target.value)} /><p className="mt-1 text-xs leading-6 text-muted">{t.summaryHint}</p></div>
      {type ? (
        <fieldset className="mt-5">
          <legend className="field-label">{t.docs}</legend>
          <p className="mb-2 text-xs leading-6 text-muted">{t.docsHint}</p>
          <div className="grid gap-2 md:grid-cols-2">
            {type.docs.map((d) => (
              <label key={d.en} className="flex items-start gap-2 rounded-lg border border-sand bg-white/60 px-3 py-2 text-sm">
                <input type="checkbox" className="mt-1" checked={docs.includes(d[language])} onChange={(e) => setDocs((p) => e.target.checked ? [...p, d[language]] : p.filter((x) => x !== d[language]))} />
                <span>{d[language]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={f.website} onChange={(e) => set("website", e.target.value)} />
      <label className="mt-5 flex items-start gap-2 text-sm"><input type="checkbox" required className="mt-1" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} /><span>{t.consent}</span></label>
      {state === "error" ? <p className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600"><AlertCircle size={16} />{t.err}</p> : null}
      <FileField kind="intake" max={3} label={{ ar: "إرفاق ملفات (اختياري)", en: "Attach files (optional)", fr: "Joindre des fichiers (facultatif)" }[language]} onChange={setAttachmentIds} />
      <button type="submit" disabled={state === "loading"} className="btn btn-ink mt-6 w-full md:w-auto disabled:opacity-60">{state === "loading" ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}{t.submit}</button>
    </form>
  );
}
