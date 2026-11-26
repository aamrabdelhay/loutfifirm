"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const KEY = "cookie_consent_v1"; // "all" | "essential"

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const path = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { try { setShow(!localStorage.getItem(KEY)); } catch { setShow(false); } }, []);
  const visible = show && !path.startsWith("/admin");
  // While the banner is open, reserve its height at the bottom of the page so no form button is ever hidden behind it.
  useEffect(() => {
    if (!visible) return;
    const el = ref.current;
    if (!el) return;
    const apply = () => { document.body.style.paddingBottom = `${el.offsetHeight + 24}px`; };
    apply();
    window.addEventListener("resize", apply);
    return () => { window.removeEventListener("resize", apply); document.body.style.paddingBottom = ""; };
  }, [visible]);
  if (!visible) return null;
  const choose = (v: "all" | "essential") => {
    try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setShow(false);
  };
  return (
    <div ref={ref} role="dialog" aria-label="ملفات تعريف الارتباط" className="fixed inset-x-3 bottom-3 z-[9999] mx-auto max-w-xl rounded-2xl border border-white/20 bg-[#0b1220] p-4 text-sm text-white shadow-2xl">
      <p className="leading-7">نستخدم ملفات ضرورية لعمل الموقع. ملفات التحليل (مصدر الزيارة) اختيارية ولا تعمل إلا بموافقتك. <Link href="/privacy" className="underline">سياسة الخصوصية</Link></p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => choose("all")} className="rounded-lg bg-white px-4 py-2 font-bold text-black">موافق على الكل</button>
        <button onClick={() => choose("essential")} className="rounded-lg border border-white/40 px-4 py-2 font-bold">الضرورية فقط</button>
      </div>
    </div>
  );
}
