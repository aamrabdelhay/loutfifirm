"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, FileText, MonitorPlay, BookOpen, Scale, HelpCircle, History, Trophy, GraduationCap, Inbox,
  Settings, LogOut, ExternalLink, Loader2, Save, CheckCircle2, KeyRound, ShieldCheck, Menu, X, Newspaper, Bot,
  type LucideIcon,
} from "lucide-react";
import { ENTITY_CONFIGS } from "@/lib/admin-config";
import { ContentEditor } from "./editors";
import { CollectionManager } from "./collections";
import { Submissions } from "./submissions";
import { adminFetch, clearToken } from "./api-client";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;
type AdminData = { content: any; entities: Record<string, Row[]>; applications: Row[]; messages: Row[]; hasPassword: boolean };
type AssistantSettings = { configured: boolean; source: "environment" | "admin" | "none"; maskedKey: string; model: string; endpoint: string };

const TAB_DEFS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "لوحة المعلومات", icon: LayoutDashboard }, { key: "content", label: "محتوى الموقع", icon: FileText },
  { key: "articles", label: "المقالات", icon: Newspaper }, { key: "media", label: "الوسائط والفيديو", icon: MonitorPlay },
  { key: "books", label: "الكتب والمؤلفات", icon: BookOpen }, { key: "services", label: "الخدمات القانونية", icon: Scale },
  { key: "faqs", label: "الأسئلة الشائعة", icon: HelpCircle }, { key: "timeline", label: "المسيرة الزمنية", icon: History },
  { key: "awards", label: "الجوائز", icon: Trophy }, { key: "applications", label: "طلبات التدريب", icon: GraduationCap },
  { key: "messages", label: "رسائل التواصل", icon: Inbox }, { key: "settings", label: "الإعدادات", icon: Settings },
];

export function AdminApp() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentDraft, setContentDraft] = useState<any>(null);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [assistant, setAssistant] = useState<AssistantSettings | null>(null);
  const [assistantKey, setAssistantKey] = useState("");
  const [assistantModel, setAssistantModel] = useState("gpt-4o-mini");
  const [assistantEndpoint, setAssistantEndpoint] = useState("https://api.openai.com/v1/chat/completions");
  const [assistantEditing, setAssistantEditing] = useState(false);
  const [assistantSaving, setAssistantSaving] = useState(false);
  const [assistantMsg, setAssistantMsg] = useState("");

  const loadAssistant = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/assistant-settings", { cache: "no-store" });
      if (!res.ok) return;
      const d = await res.json();
      if (d.ok) {
        setAssistant(d);
        setAssistantModel(d.model || "gpt-4o-mini");
        setAssistantEndpoint(d.endpoint || "https://api.openai.com/v1/chat/completions");
      }
    } catch { /* keep the rest of admin usable */ }
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/data", { cache: "no-store" });
      if (res.status === 401) { window.location.reload(); return; }
      const d = await res.json();
      if (!d.ok) throw new Error();
      setData(d); setContentDraft(d.content); await loadAssistant();
    } catch { setLoadError("تعذر تحميل بيانات الإدارة — حاول تحديث الصفحة."); }
  }, [loadAssistant]);

  useEffect(() => { load(); }, [load]);

  const updateEntityRows = (key: string, rows: Row[]) => setData((d) => (d ? { ...d, entities: { ...d.entities, [key]: rows } } : d));

  async function saveContent() {
    setContentSaving(true); setContentSaved(false);
    try {
      const res = await adminFetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: contentDraft }) });
      if (!res.ok) throw new Error();
      setContentSaved(true); setData((d) => (d ? { ...d, content: contentDraft } : d)); setTimeout(() => setContentSaved(false), 3000);
    } catch { alert("تعذر حفظ المحتوى"); } finally { setContentSaving(false); }
  }

  async function savePassword() {
    setSettingsMsg("");
    try {
      const res = await adminFetch("/api/admin/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: newPassword }) });
      const d = await res.json(); if (!res.ok || !d.ok) throw new Error();
      setData((prev) => (prev ? { ...prev, hasPassword: d.hasPassword } : prev)); setNewPassword("");
      setSettingsMsg(d.hasPassword ? "تم تعيين كلمة المرور الجديدة بنجاح." : "تمت إزالة كلمة المرور — الدخول الآن بدون كلمة مرور.");
    } catch { setSettingsMsg("تعذر حفظ كلمة المرور."); }
  }

  async function saveAssistant() {
    if (!assistantKey.trim()) return;
    setAssistantSaving(true); setAssistantMsg("");
    try {
      const res = await adminFetch("/api/admin/assistant-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apiKey: assistantKey, model: assistantModel, endpoint: assistantEndpoint }) });
      const d = await res.json(); if (!res.ok || !d.ok) throw new Error();
      setAssistant({ configured: true, source: "admin", maskedKey: d.maskedKey, model: d.model, endpoint: d.endpoint });
      setAssistantKey(""); setAssistantEditing(false); setAssistantMsg("تم حفظ إعدادات المساعد بنجاح. تم إخفاء المفتاح من الواجهة.");
    } catch { setAssistantMsg("تعذر حفظ إعدادات المساعد."); } finally { setAssistantSaving(false); }
  }

  async function logout() { await adminFetch("/api/admin/logout", { method: "POST" }).catch(() => {}); clearToken(); window.location.reload(); }

  if (loadError) return <div className="ink-surface grid min-h-screen place-items-center px-4"><p className="rounded-xl border border-red-400/30 bg-red-500/10 px-8 py-6 text-center text-red-200">{loadError}</p></div>;
  if (!data) return <div className="ink-surface grid min-h-screen place-items-center"><Loader2 size={36} className="animate-spin text-steel-400" /></div>;

  const activeTab = TAB_DEFS.find((t) => t.key === tab) ?? TAB_DEFS[0];
  const entityConfig = ENTITY_CONFIGS.find((e) => e.key === tab);
  const newApps = data.applications.filter((a) => a.status === "new").length;
  const newMsgs = data.messages.filter((m) => m.status === "new").length;
  const stats = [
    { label: "مقال منشور", value: data.entities.articles?.length ?? 0, key: "articles", icon: Newspaper }, { label: "فيديو / وسائط", value: data.entities.media?.length ?? 0, key: "media", icon: MonitorPlay },
    { label: "كتاب ومرجع", value: data.entities.books?.length ?? 0, key: "books", icon: BookOpen }, { label: "خدمة قانونية", value: data.entities.services?.length ?? 0, key: "services", icon: Scale },
    { label: "طلبات تدريب جديدة", value: newApps, key: "applications", icon: GraduationCap }, { label: "رسائل جديدة", value: newMsgs, key: "messages", icon: Inbox },
  ];

  return (
    <div className="flex min-h-screen bg-[#efe9da]">
      <aside className={cn("fixed inset-y-0 end-0 z-[60] w-72 ink-surface transition-transform duration-500 lg:static lg:translate-x-0", sidebarOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0")}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-steel-500/15 px-5 py-5"><div><p className="font-display text-xl font-bold text-steel-100">لوحة التحكم</p><p className="text-[11px] text-[#a9b6cd]">أ.د/ حسام لطفي — LAW FIRM</p></div><button onClick={() => setSidebarOpen(false)} className="grid size-9 place-items-center rounded-lg border border-steel-500/30 text-steel-200 lg:hidden"><X size={17} /></button></div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3.5">{TAB_DEFS.map((t) => <button key={t.key} onClick={() => { setTab(t.key); setSidebarOpen(false); }} className={cn("admin-tab", tab === t.key && "active")}><t.icon size={17} className="shrink-0" /><span className="flex-1">{t.label}</span>{t.key === "applications" && newApps > 0 ? <span className="badge bg-steel-500 text-ink-950">{newApps}</span> : null}{t.key === "messages" && newMsgs > 0 ? <span className="badge bg-steel-500 text-ink-950">{newMsgs}</span> : null}</button>)}</nav>
          <div className="space-y-2 border-t border-steel-500/15 p-3.5"><Link href="/" target="_blank" className="admin-tab"><ExternalLink size={16} />معاينة الموقع</Link><button onClick={logout} className="admin-tab !text-red-300 hover:!text-red-200"><LogOut size={16} />تسجيل الخروج</button></div>
        </div>
      </aside>
      {sidebarOpen ? <div className="fixed inset-0 z-[55] bg-ink-950/60 lg:hidden" onClick={() => setSidebarOpen(false)} /> : null}
      <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-8">
        <div className="mb-7 flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><button onClick={() => setSidebarOpen(true)} className="grid size-11 shrink-0 place-items-center rounded-lg border border-sand bg-white/80 text-ink-800 lg:hidden"><Menu size={19} /></button><div className="min-w-0"><h1 className="font-display truncate text-2xl font-bold text-ink-900 md:text-3xl">{activeTab.label}</h1><p className="text-xs text-muted">كل ما تنشره هنا يظهر مباشرة على الموقع</p></div></div>{tab === "content" ? <button onClick={saveContent} disabled={contentSaving} className="btn btn-ink shrink-0 !px-4 !py-2.5 !text-sm disabled:opacity-60">{contentSaving ? <Loader2 size={16} className="animate-spin" /> : contentSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}{contentSaved ? "تم الحفظ" : "حفظ المحتوى"}</button> : null}</div>

        {tab === "dashboard" ? <div className="space-y-7"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{stats.map((s) => <button key={s.key} onClick={() => setTab(s.key)} className="card-elegant flex items-center gap-4 p-5 text-start"><span className="grid size-13 shrink-0 place-items-center rounded-xl bg-ink-900 text-steel-300"><s.icon size={22} /></span><span><span className="font-display block text-3xl font-bold text-ink-900">{s.value}</span><span className="text-sm text-muted">{s.label}</span></span></button>)}</div><div className="rounded-xl border border-steel-500/30 bg-white/80 p-6"><h3 className="flex items-center gap-2 font-bold text-ink-900"><ShieldCheck size={18} className="text-steel-600" />حالة الأمان</h3><p className="mt-2 text-sm leading-7 text-muted">{data.hasPassword ? "لوحة التحكم محمية بكلمة مرور. يمكنك تغييرها أو إزالتها من تبويب «الإعدادات»." : "لم يتم تعيين كلمة مرور بعد — أي شخص يصل لرابط /admin يمكنه الدخول مباشرة. يمكنك تعيين كلمة مرور من تبويب «الإعدادات»."}</p><button onClick={() => setTab("settings")} className="btn btn-outline-ink mt-4 !px-5 !py-2.5 !text-sm"><KeyRound size={15} />إدارة كلمة المرور</button></div></div> : null}
        {tab === "content" && contentDraft ? <ContentEditor value={contentDraft} onChange={setContentDraft} /> : null}
        {entityConfig ? <CollectionManager config={entityConfig} rows={data.entities[entityConfig.key] ?? []} onRows={(rows) => updateEntityRows(entityConfig.key, rows)} /> : null}
        {tab === "applications" ? <Submissions kind="applications" items={data.applications} onItems={(rows) => setData((d) => (d ? { ...d, applications: rows } : d))} /> : null}
        {tab === "messages" ? <Submissions kind="messages" items={data.messages} onItems={(rows) => setData((d) => (d ? { ...d, messages: rows } : d))} /> : null}

        {tab === "settings" ? <div className="max-w-2xl space-y-6">
          <div className="rounded-xl border border-sand bg-white/85 p-5 md:p-7">
            <h3 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900"><Bot size={20} className="text-steel-600" />إعدادات المساعد الذكي</h3>
            <p className="mt-2 text-sm leading-7 text-muted">المساعد يجيب فقط من معلومات الموقع، ويرفض الاستشارات القانونية والموضوعات الخارجة عن نطاق المكتب. يفضّل استخدام متغير البيئة على Vercel لحماية المفتاح.</p>
            {assistant?.configured && !assistantEditing ? <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold text-green-800">المفتاح محفوظ</p><p className="mt-1 font-mono text-sm text-green-900 break-all">{assistant.maskedKey}</p><p className="mt-1 text-xs text-green-700">{assistant.source === "environment" ? "المصدر: Vercel Environment Variable" : "المصدر: إعدادات لوحة الإدارة"}</p></div><button onClick={() => setAssistantEditing(true)} className="btn btn-outline-ink !px-4 !py-2 !text-sm">استبدال / تعديل</button></div></div> : <div className="mt-5 space-y-4"><div><label className="field-label">API Key</label><input type="password" className="admin-input" value={assistantKey} onChange={(e) => setAssistantKey(e.target.value)} placeholder="أدخل مفتاح مزود الـ API" autoComplete="off" /></div><div><label className="field-label">Model</label><input className="admin-input" value={assistantModel} onChange={(e) => setAssistantModel(e.target.value)} placeholder="gpt-4o-mini" /></div><div><label className="field-label">Endpoint</label><input className="admin-input" value={assistantEndpoint} onChange={(e) => setAssistantEndpoint(e.target.value)} placeholder="https://api.openai.com/v1/chat/completions" inputMode="url" /></div><div className="flex flex-wrap gap-2"><button onClick={saveAssistant} disabled={!assistantKey.trim() || assistantSaving} className="btn btn-ink !px-5 !py-2.5 !text-sm disabled:opacity-50">{assistantSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}حفظ إعدادات المساعد</button>{assistantEditing ? <button onClick={() => { setAssistantEditing(false); setAssistantKey(""); }} className="btn btn-outline-ink !px-5 !py-2.5 !text-sm">إلغاء</button> : null}</div></div>}
            {assistantMsg ? <p className="mt-3 text-sm font-bold text-green-700">{assistantMsg}</p> : null}
          </div>

          <div className="rounded-xl border border-sand bg-white/85 p-5 md:p-7"><h3 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900"><KeyRound size={19} className="text-steel-600" />كلمة مرور لوحة التحكم</h3><p className="mt-2 text-sm leading-7 text-muted">الحالة الحالية: <b className={data.hasPassword ? "text-green-700" : "text-steel-700"}>{data.hasPassword ? "مُعينة — لوحة التحكم محمية" : "غير مُعينة — الدخول بدون كلمة مرور"}</b></p><div className="mt-5 space-y-3"><label className="field-label">{data.hasPassword ? "كلمة مرور جديدة" : "تعيين كلمة مرور"}</label><input type="password" className="admin-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={data.hasPassword ? "اتركها فارغة لإزالة كلمة المرور" : "اكتب كلمة المرور الجديدة"} /><p className="text-xs leading-6 text-muted">اترك الحقل فارغًا ثم اضغط «حفظ» لإزالة كلمة المرور نهائيًا.</p><button onClick={savePassword} className="btn btn-ink !px-6 !py-2.5 !text-sm"><Save size={15} />حفظ</button>{settingsMsg ? <p className="text-sm font-bold text-green-700">{settingsMsg}</p> : null}</div></div>
          <div className="rounded-xl border border-sand bg-white/85 p-5 md:p-7"><h3 className="font-display text-xl font-bold text-ink-900">الجلسة</h3><p className="mt-2 text-sm text-muted">تسجيل الخروج من لوحة التحكم على هذا الجهاز.</p><button onClick={logout} className="btn btn-outline-ink mt-4 !px-6 !py-2.5 !text-sm"><LogOut size={15} />تسجيل الخروج</button></div>
        </div> : null}
      </main>
    </div>
  );
}
