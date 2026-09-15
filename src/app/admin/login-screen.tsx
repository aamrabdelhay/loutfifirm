"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Scale, Lock, Loader2, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { useSiteLanguage, type SiteLanguage } from "@/components/site-language";
import { AdminLanguageSwitcher } from "./admin-language";

const copy: Record<SiteLanguage, {
  title: string;
  description: string;
  password: string;
  enterPassword: string;
  leaveEmpty: string;
  assigned: string;
  notAssigned: string;
  login: string;
  back: string;
  invalid: string;
  error: string;
}> = {
  ar: {
    title: "لوحة التحكم",
    description: "إدارة محتوى موقع أ.د/ حسام لطفي بالكامل",
    password: "كلمة المرور",
    enterPassword: "أدخل كلمة المرور",
    leaveEmpty: "اتركها فارغة واضغط دخول",
    assigned: "تم تعيين كلمة مرور — أدخلها للمتابعة.",
    notAssigned: "لم يتم تعيين كلمة مرور بعد — اترك الحقل فارغًا واضغط «دخول». يمكنك تعيين كلمة مرور لاحقًا من الإعدادات.",
    login: "دخول",
    back: "العودة إلى الموقع",
    invalid: "كلمة المرور غير صحيحة",
    error: "حدث خطأ",
  },
  en: {
    title: "Admin Dashboard",
    description: "Manage the entire Dr. Hossam Loutfi website",
    password: "Password",
    enterPassword: "Enter your password",
    leaveEmpty: "Leave empty and press Sign in",
    assigned: "A password is set — enter it to continue.",
    notAssigned: "No password is set yet — leave this field empty and press Sign in. You can set one later from Settings.",
    login: "Sign in",
    back: "Back to website",
    invalid: "Incorrect password",
    error: "An error occurred",
  },
  fr: {
    title: "Tableau de bord",
    description: "Gérer l’ensemble du site du Dr Hossam Loutfi",
    password: "Mot de passe",
    enterPassword: "Saisissez votre mot de passe",
    leaveEmpty: "Laissez vide et cliquez sur Connexion",
    assigned: "Un mot de passe est défini — saisissez-le pour continuer.",
    notAssigned: "Aucun mot de passe n’est encore défini — laissez le champ vide et cliquez sur Connexion. Vous pourrez en définir un dans les paramètres.",
    login: "Connexion",
    back: "Retour au site",
    invalid: "Mot de passe incorrect",
    error: "Une erreur est survenue",
  },
};

export function LoginScreen({ passwordSet, onSuccess }: { passwordSet: boolean; onSuccess: (token: string) => void }) {
  const { language } = useSiteLanguage();
  const t = copy[language];
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || t.invalid);
      onSuccess(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
      setLoading(false);
    }
  }

  return (
    <div className="ink-surface grid min-h-screen place-items-center px-4 py-10" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="fixed top-5 end-5 z-20"><AdminLanguageSwitcher /></div>
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto grid size-16 rotate-45 place-items-center rounded-2xl border border-steel-500/40 bg-gradient-to-br from-steel-400/20 to-transparent">
            <Scale className="-rotate-45 text-steel-200" size={28} strokeWidth={1.5} />
          </span>
          <h1 className="font-display mt-7 text-3xl font-bold text-steel-100">{t.title}</h1>
          <p className="mt-2 text-sm text-[#a8b1bb]">{t.description}</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-steel-500/25 bg-ink-900/85 p-8 shadow-2xl backdrop-blur">
          <label className="field-label !text-steel-200" htmlFor="admin-pass">
            <Lock size={14} className="ms-0 me-1.5 inline-block -translate-y-px" />
            {t.password}
          </label>
          <input id="admin-pass" type="password" className="admin-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={passwordSet ? t.enterPassword : t.leaveEmpty} autoFocus />
          {passwordSet ? (
            <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-[#a8b1bb]"><KeyRound size={13} className="mt-1 shrink-0 text-steel-400" />{t.assigned}</p>
          ) : (
            <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-steel-300/90"><ShieldCheck size={13} className="mt-1 shrink-0" />{t.notAssigned}</p>
          )}
          {error ? <p className="mt-3 text-sm font-bold text-red-400">{error}</p> : null}
          <button type="submit" disabled={loading} className="btn btn-ivory mt-6 w-full disabled:opacity-60">{loading ? <Loader2 size={18} className="animate-spin" /> : null}{t.login}</button>
        </form>

        <Link href="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-[#a8b1bb] transition-colors hover:text-steel-200">
          <ArrowRight size={15} />{t.back}
        </Link>
      </div>
    </div>
  );
}
