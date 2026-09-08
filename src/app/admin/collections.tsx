"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Save, MonitorPlay, Eye, EyeOff } from "lucide-react";
import type { EntityConfig, FieldConfig } from "@/lib/admin-config";
import { adminFetch } from "./api-client";
import { youtubeThumb } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

function defaultDraft(config: EntityConfig, rows: Row[]): Row {
  const d: Row = {};
  for (const f of config.fields) {
    switch (f.type) {
      case "toggle":
        d[f.key] = f.key === "published";
        break;
      case "number":
        d[f.key] = rows.length + 1;
        break;
      case "list":
        d[f.key] = [];
        break;
      case "select":
        d[f.key] = f.options?.[0]?.value ?? "";
        break;
      default:
        d[f.key] = "";
    }
  }
  return d;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  onChange: (v: any) => void;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          className="admin-input leading-7"
          rows={field.rows ?? 3}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          className="admin-input"
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "toggle":
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={cn(
            "relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-300",
            value ? "bg-steel-500" : "bg-[#d8d2c2]"
          )}
        >
          <span
            className={cn(
              "absolute size-5.5 rounded-full bg-white shadow transition-all duration-300",
              value ? "end-0.5" : "start-0.5"
            )}
          />
        </button>
      );
    case "select":
      return (
        <select className="admin-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "image":
      return (
        <div className="space-y-2">
          <input
            className="admin-input"
            dir="ltr"
            value={value ?? ""}
            placeholder={field.placeholder ?? "https://…"}
            onChange={(e) => onChange(e.target.value)}
          />
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="معاينة" className="h-28 w-48 rounded-lg border border-sand object-cover" />
          ) : null}
        </div>
      );
    case "list":
      return (
        <textarea
          className="admin-input min-h-28 leading-7"
          value={Array.isArray(value) ? value.join("\n") : ""}
          placeholder="سطر لكل عنصر"
          onChange={(e) => onChange(e.target.value.split("\n"))}
        />
      );
    default:
      return (
        <input
          className="admin-input"
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

export function CollectionManager({
  config,
  rows,
  onRows,
}: {
  config: EntityConfig;
  rows: Row[];
  onRows: (rows: Row[]) => void;
}) {
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  function openNew() {
    setEditing(defaultDraft(config, rows));
    setIsNew(true);
    setError("");
  }
  function openEdit(row: Row) {
    setEditing({ ...row });
    setIsNew(false);
    setError("");
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    const payload: Row = {};
    for (const f of config.fields) {
      const v = editing[f.key];
      payload[f.key] = f.type === "list" && Array.isArray(v) ? v.filter((x) => String(x).trim() !== "") : v;
    }
    try {
      const res = await fetch(
        isNew ? `/api/admin/${config.key}` : `/api/admin/${config.key}/${editing.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "تعذر الحفظ");
      if (isNew) {
        onRows([data.row, ...rows]);
      } else {
        onRows(rows.map((r) => (r.id === data.row.id ? data.row : r)));
      }
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`هل أنت متأكد من حذف «${row[config.titleField] || "هذا العنصر"}»؟`)) return;
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/${config.key}/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onRows(rows.filter((r) => r.id !== row.id));
    } catch {
      alert("تعذر الحذف");
    } finally {
      setBusyId(null);
    }
  }

  const thumbOf = (row: Row) => {
    if (row.image) return row.image;
    if (row.url && youtubeThumb(row.url)) return youtubeThumb(row.url);
    return "";
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {rows.length} عنصر — أضف وعدّل واحذف بحرية، والتغييرات تظهر فورًا على الموقع.
        </p>
        <button onClick={openNew} className="btn btn-ink !py-2.5 !px-5 !text-sm">
          <Plus size={16} />
          إضافة {config.singular}
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const thumb = thumbOf(row);
          return (
            <div
              key={row.id}
              className="flex items-center gap-4 rounded-xl border border-sand bg-white/85 p-4 transition-shadow hover:shadow-md"
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="hidden h-14 w-20 shrink-0 rounded-lg object-cover sm:block" />
              ) : row.url ? (
                <span className="hidden h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-steel-300 sm:flex">
                  <MonitorPlay size={20} />
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink-900">
                  {row[config.titleField] || <span className="text-muted">(بدون عنوان)</span>}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  {config.descField && row[config.descField] ? (
                    <span className="badge bg-sand/70 text-ink-800">{row[config.descField]}</span>
                  ) : null}
                  {"published" in row ? (
                    row.published ? (
                      <span className="badge bg-green-100 text-green-700">
                        <Eye size={11} /> منشور
                      </span>
                    ) : (
                      <span className="badge bg-stone-200 text-stone-600">
                        <EyeOff size={11} /> مسودة
                      </span>
                    )
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(row)}
                  className="grid size-10 place-items-center rounded-lg border border-sand text-ink-700 transition-colors hover:border-steel-500 hover:text-steel-600"
                  aria-label="تعديل"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(row)}
                  disabled={busyId === row.id}
                  className="grid size-10 place-items-center rounded-lg border border-red-200 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="حذف"
                >
                  {busyId === row.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          );
        })}
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-sand bg-white/60 p-10 text-center text-sm text-muted">
            لا توجد عناصر بعد — ابدأ بإضافة {config.singular} جديد.
          </p>
        ) : null}
      </div>

      {/* Editor drawer */}
      {editing ? (
        <div className="fixed inset-0 z-[70] flex justify-start bg-ink-950/60 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div
            className="h-full w-full max-w-xl overflow-y-auto bg-ivory p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-ink-900">
                {isNew ? `إضافة ${config.singular}` : `تعديل ${config.singular}`}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="grid size-10 place-items-center rounded-lg border border-sand text-ink-700 hover:border-steel-500"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {config.fields.map((f) => (
                <div key={f.key}>
                  <label className="field-label">{f.label}</label>
                  {f.hint ? <p className="mb-1.5 text-xs text-muted">{f.hint}</p> : null}
                  <FieldInput
                    field={f}
                    value={editing[f.key]}
                    onChange={(v) => setEditing((prev) => (prev ? { ...prev, [f.key]: v } : prev))}
                  />
                </div>
              ))}
            </div>

            {error ? <p className="mt-4 text-sm font-bold text-red-600">{error}</p> : null}

            <div className="sticky bottom-0 mt-8 flex gap-3 border-t border-sand bg-ivory py-4">
              <button onClick={save} disabled={saving} className="btn btn-ink flex-1 disabled:opacity-60">
                {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                حفظ
              </button>
              <button onClick={() => setEditing(null)} className="btn btn-outline-ink">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
