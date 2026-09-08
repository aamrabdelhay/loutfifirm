"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Scale, Lock, Loader2, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export function LoginScreen({
  passwordSet,
  onSuccess,
}: {
  passwordSet: boolean;
  onSuccess: (token: string) => void;
}) {
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
      if (!res.ok || !data.ok) throw new Error(data.error || "كلمة المرور غير صحيحة");
      onSuccess(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      setLoading(false);
    }
  }

  return (
    <div className="ink-surface grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto grid size-16 rotate-45 place-items-center rounded-2xl border border-steel-500/40 bg-gradient-to-br from-steel-400/20 to-transparent">
            <Scale className="-rotate-45 text-steel-200" size={28} strokeWidth={1.5} />
          </span>
          <h1 className="font-display mt-7 text-3xl font-bold text-steel-100">لوحة التحكم</h1>
          <p className="mt-2 text-sm text-[#a8b1bb]">إدارة محتوى موقع أ.د/ حسام لطفي بالكامل</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl border border-steel-500/25 bg-ink-900/85 p-8 shadow-2xl backdrop-blur"
        >
          <label className="field-label !text-steel-200" htmlFor="admin-pass">
            <Lock size={14} className="ms-0 me-1.5 inline-block -translate-y-px" />
            كلمة المرور
          </label>
          <input
            id="admin-pass"
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={passwordSet ? "أدخل كلمة المرور" : "اتركها فارغة واضغط دخول"}
            autoFocus
          />
          {passwordSet ? (
            <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-[#a8b1bb]">
              <KeyRound size={13} className="mt-1 shrink-0 text-steel-400" />
              تم تعيين كلمة مرور — أدخلها للمتابعة.
            </p>
          ) : (
            <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-steel-300/90">
              <ShieldCheck size={13} className="mt-1 shrink-0" />
              لم يتم تعيين كلمة مرور بعد — اترك الحقل فارغًا واضغط «دخول». يمكنك تعيين كلمة مرور لاحقًا من الإعدادات.
            </p>
          )}

          {error ? <p className="mt-3 text-sm font-bold text-red-400">{error}</p> : null}

          <button type="submit" disabled={loading} className="btn btn-ivory mt-6 w-full disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            دخول
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-[#a8b1bb] transition-colors hover:text-steel-200"
        >
          <ArrowRight size={15} />
          العودة إلى الموقع
        </Link>
      </div>
    </div>
  );
}
