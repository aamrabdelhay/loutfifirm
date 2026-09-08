"use client";

import { useState } from "react";
import {
  Loader2,
  Trash2,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  BookOpen,
  MessageSquare,
  Link2,
} from "lucide-react";
import { adminFetch } from "./api-client";
import { formatArDate, cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

const APP_STATUSES: Record<string, { label: string; cls: string }> = {
  new: { label: "جديد", cls: "bg-steel-500/15 text-steel-700 border-steel-500/40" },
  contacted: { label: "تم التواصل", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  accepted: { label: "مقبول", cls: "bg-green-50 text-green-700 border-green-200" },
  rejected: { label: "مرفوض", cls: "bg-red-50 text-red-600 border-red-200" },
};

const MSG_STATUSES: Record<string, { label: string; cls: string }> = {
  new: { label: "جديدة", cls: "bg-steel-500/15 text-steel-700 border-steel-500/40" },
  read: { label: "مقروءة", cls: "bg-green-50 text-green-700 border-green-200" },
};

export function Submissions({
  kind,
  items,
  onItems,
}: {
  kind: "applications" | "messages";
  items: Row[];
  onItems: (rows: Row[]) => void;
}) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const statuses = kind === "applications" ? APP_STATUSES : MSG_STATUSES;
  const isApp = kind === "applications";

  async function setStatus(row: Row, status: string) {
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/${kind}/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      onItems(items.map((r) => (r.id === row.id ? { ...r, status } : r)));
    } catch {
      alert("تعذر تحديث الحالة");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`حذف ${isApp ? "طلب" : "رسالة"} «${row.name}» نهائيًا؟`)) return;
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/${kind}/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onItems(items.filter((r) => r.id !== row.id));
    } catch {
      alert("تعذر الحذف");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {items.length} {isApp ? "طلب تدريب" : "رسالة"} —{" "}
        {items.filter((i) => i.status === "new").length} جديدة لم تُعالج بعد.
      </p>

      {items.map((row) => (
        <article key={row.id} className="rounded-xl border border-sand bg-white/85 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-bold text-ink-900">{row.name}</h3>
                <span className={cn("badge border", statuses[row.status]?.cls ?? "")}>
                  {statuses[row.status]?.label ?? row.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{formatArDate(row.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="admin-input !w-auto !py-2 !text-[13px]"
                value={row.status}
                disabled={busyId === row.id}
                onChange={(e) => setStatus(row, e.target.value)}
              >
                {Object.entries(statuses).map(([v, s]) => (
                  <option key={v} value={v}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => remove(row)}
                disabled={busyId === row.id}
                className="grid size-10 place-items-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600"
                aria-label="حذف"
              >
                {busyId === row.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>

          {isApp ? (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 text-[#3c4a66]">
                <Building2 size={15} className="shrink-0 text-steel-600" />
                <b>الجامعة:</b> {row.university}
              </p>
              <p className="flex items-center gap-2 text-[#3c4a66]">
                <GraduationCap size={15} className="shrink-0 text-steel-600" />
                <b>الفرقة:</b> {row.year}
              </p>
              <p className="flex items-center gap-2 text-[#3c4a66]" dir="ltr">
                <Phone size={15} className="shrink-0 text-steel-600" />
                {row.phone}
              </p>
              <p className="flex items-center gap-2 text-[#3c4a66]" dir="ltr">
                <Mail size={15} className="shrink-0 text-steel-600" />
                {row.email}
              </p>
              {row.linkedin ? (
                <a
                  href={row.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-700 hover:underline sm:col-span-2"
                  dir="ltr"
                >
                  <Link2 size={15} className="shrink-0" />
                  {row.linkedin}
                </a>
              ) : null}
              {Array.isArray(row.experiences) && row.experiences.length > 0 ? (
                <div className="sm:col-span-2">
                  <p className="mb-1.5 flex items-center gap-2 font-bold text-ink-800">
                    <BookOpen size={15} className="text-steel-600" />
                    الخبرات السابقة والتدريبات:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {row.experiences.map((e: string, i: number) => (
                      <span key={i} className="badge border border-sand bg-cream text-ink-800">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="rounded-lg border border-steel-500/25 bg-steel-500/6 p-3.5 sm:col-span-2">
                <p className="mb-1 font-bold text-ink-800">عايز تتدرب ليه؟</p>
                <p className="leading-7 text-[#3c4a66]">{row.reason}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 text-[#3c4a66]" dir="ltr">
                <Phone size={15} className="shrink-0 text-steel-600" />
                {row.phone}
              </p>
              {row.email ? (
                <p className="flex items-center gap-2 text-[#3c4a66]" dir="ltr">
                  <Mail size={15} className="shrink-0 text-steel-600" />
                  {row.email}
                </p>
              ) : null}
              {row.type ? (
                <p className="flex items-center gap-2 text-[#3c4a66]">
                  <Link2 size={15} className="shrink-0 text-steel-600" />
                  <b>نوع الاستفسار:</b> {row.type}
                </p>
              ) : null}
              <div className="rounded-lg border border-steel-500/25 bg-steel-500/6 p-3.5 sm:col-span-2">
                <p className="mb-1 flex items-center gap-2 font-bold text-ink-800">
                  <MessageSquare size={15} className="text-steel-600" />
                  نص الاستفسار:
                </p>
                <p className="leading-7 text-[#3c4a66]">{row.message}</p>
              </div>
            </div>
          )}
        </article>
      ))}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-sand bg-white/60 p-10 text-center text-sm text-muted">
          لا توجد {isApp ? "طلبات تدريب" : "رسائل"} حتى الآن.
        </p>
      ) : null}
    </div>
  );
}
