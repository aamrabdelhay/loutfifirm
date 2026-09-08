"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Plus, Trash2, ImageIcon } from "lucide-react";
import { CONTENT_SECTIONS } from "@/lib/admin-config";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function getPath(obj: any, path: string): any {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function setPathImmutable(obj: any, path: string, value: any): any {
  const keys = path.split(".");
  const root: any = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = root;
  let src = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const nextSrc = src?.[k] ?? {};
    const nextClone: any = Array.isArray(nextSrc) ? [...nextSrc] : { ...nextSrc };
    cur[k] = nextClone;
    cur = nextClone;
    src = nextSrc;
  }
  cur[keys[keys.length - 1]] = value;
  return root;
}

export function FieldShell({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-6 text-muted">{hint}</p> : null}
    </div>
  );
}

function ListTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: unknown;
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const lines = Array.isArray(value) ? (value as string[]).join("\n") : String(value ?? "");
  return (
    <textarea
      className="admin-input min-h-28 leading-7"
      value={lines}
      placeholder={placeholder ?? "سطر لكل عنصر"}
      onChange={(e) => onChange(e.target.value.split("\n"))}
    />
  );
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="admin-input"
          dir="ltr"
          placeholder="https://… أو /img/…"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {value ? (
        <div className="relative w-40 overflow-hidden rounded-lg border border-sand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="معاينة" className="h-24 w-full object-cover" />
        </div>
      ) : (
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <ImageIcon size={13} /> ستظهر معاينة الصورة هنا
        </p>
      )}
    </div>
  );
}

function ObjectListEditor({
  label,
  value,
  subfields,
  onChange,
}: {
  label: string;
  value: unknown;
  subfields: { key: string; label: string }[];
  onChange: (v: any[]) => void;
}) {
  const items: any[] = Array.isArray(value) ? value : [];
  const blank = Object.fromEntries(subfields.map((s) => [s.key, ""]));

  return (
    <div className="rounded-xl border border-sand bg-cream/60 p-4">
      <p className="field-label">{label}</p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-sand bg-white/70 p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-steel-700">
                {label} رقم {i + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="grid size-8 place-items-center rounded-md border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600"
                aria-label="حذف"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className={cn("grid gap-2.5", subfields.length > 1 ? "md:grid-cols-2" : "")}>
              {subfields.map((sf) => (
                <input
                  key={sf.key}
                  className="admin-input !py-2 !text-[13px]"
                  placeholder={sf.label}
                  value={item?.[sf.key] ?? ""}
                  onChange={(e) =>
                    onChange(items.map((x, idx) => (idx === i ? { ...x, [sf.key]: e.target.value } : x)))
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, blank])}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-steel-500/60 px-3.5 py-2 text-[13px] font-bold text-steel-700 hover:bg-steel-500/10"
      >
        <Plus size={14} />
        إضافة {label}
      </button>
    </div>
  );
}

/** Accordion of all site-content sections with live editing */
export function ContentEditor({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const [open, setOpen] = useState<string | null>("hero");

  return (
    <div className="space-y-3">
      {CONTENT_SECTIONS.map((section) => {
        const isOpen = open === section.key;
        return (
          <div key={section.key} className="overflow-hidden rounded-xl border border-sand bg-white/80">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : section.key)}
              className={cn(
                "flex w-full items-center justify-between px-5 py-4 text-start transition-colors",
                isOpen ? "bg-steel-500/10" : "hover:bg-steel-500/5"
              )}
            >
              <div>
                <span className="font-display text-lg font-bold text-ink-900">{section.title}</span>
                {section.description ? (
                  <span className="block text-xs text-muted">{section.description}</span>
                ) : null}
              </div>
              <ChevronDown
                size={19}
                className={cn("shrink-0 text-steel-600 transition-transform duration-300", isOpen && "rotate-180")}
              />
            </button>

            {isOpen ? (
              <div className="space-y-5 border-t border-sand px-5 py-5">
                {section.fields.map((f) => {
                  const v = getPath(value, f.path);
                  if (f.type === "list") {
                    return (
                      <FieldShell key={f.path} label={f.label} hint={f.hint}>
                        <ListTextarea value={v} onChange={(nv) => onChange(setPathImmutable(value, f.path, nv))} />
                      </FieldShell>
                    );
                  }
                  if (f.type === "textarea") {
                    return (
                      <FieldShell key={f.path} label={f.label} hint={f.hint}>
                        <textarea
                          className="admin-input leading-7"
                          rows={f.rows ?? 4}
                          value={v ?? ""}
                          onChange={(e) => onChange(setPathImmutable(value, f.path, e.target.value))}
                        />
                      </FieldShell>
                    );
                  }
                  if (f.type === "image") {
                    return (
                      <FieldShell key={f.path} label={f.label} hint={f.hint}>
                        <ImageInput value={v ?? ""} onChange={(nv) => onChange(setPathImmutable(value, f.path, nv))} />
                      </FieldShell>
                    );
                  }
                  return (
                    <FieldShell key={f.path} label={f.label} hint={f.hint}>
                      <input
                        className="admin-input"
                        value={v ?? ""}
                        onChange={(e) => onChange(setPathImmutable(value, f.path, e.target.value))}
                      />
                    </FieldShell>
                  );
                })}

                {section.objectLists?.map((ol) => (
                  <ObjectListEditor
                    key={ol.path}
                    label={ol.label}
                    subfields={ol.subfields}
                    value={getPath(value, ol.path)}
                    onChange={(nv) => onChange(setPathImmutable(value, ol.path, nv))}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
