"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";

/** Floating one-tap call button, mobile only. Hidden on the admin area. */
export function CallButton({ number, label }: { number: string; label: string }) {
  const path = usePathname() ?? "";
  if (path.startsWith("/admin")) return null;
  const dial = number.replace(/[^\d+]/g, "");
  if (dial.length < 6) return null;
  return (
    <a
      href={`tel:${dial}`}
      aria-label={label}
      className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-3 text-sm font-bold text-steel-100 shadow-lg ring-1 ring-steel-500/40 md:hidden"
    >
      <Phone size={18} />
      <span>{label}</span>
    </a>
  );
}
