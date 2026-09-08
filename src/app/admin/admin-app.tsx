"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  MonitorPlay,
  BookOpen,
  Scale,
  HelpCircle,
  History,
  Trophy,
  GraduationCap,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Loader2,
  Save,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Menu,
  X,
  Newspaper,
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

type AdminData = {
  content: any;
  entities: Record<string, Row[]>;
  applications: Row[];
  messages: Row[];
  hasPassword: boolean;
};

const TAB_DEFS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "لوحة المعلومات", icon: LayoutDashboard },
  { key: "content", label: "محتوى الموقع", icon: FileText },
  { key: "articles", label: "المقالات", icon: Newspaper },
  { key: "media", label: "الوسائط والفيديو", icon: MonitorPlay },
  { key: "books", label: "الكتب والمؤلفات", icon: BookOpen },
  { key: "services", label: "الخدمات القانونية", icon: Scale },
  { key: "faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
  { key: "timeline", label: "المسيرة الزمنية", icon: History },
  { key: "awards", label: "الجوائز", icon: Trophy },
  { key: "applications", label: "طلبات التدريب", icon: GraduationCap },
  { key: "messages", label: "رسائل التواصل", icon: Inbox },
  { key: "settings", label: "الإعدادات", icon: Settings },
];

export function AdminApp() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // content editing state
  const [contentDraft, setContentDraft] = useState<any>(null);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);

  // settings state
  const [newPassword, setNewPassword] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/data", { cache: "no-store" });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      const d = await res.json();
      if (!d.ok) throw new Error();
      setData(d);
      setContentDraft(d.content);
    } catch {
      setLoadError("تعذر تحميل بيانات الإدارة — حاول تحديث الصفحة.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateEntityRows = (key: string, rows: Row[]) =>
    setData((d) => (d ? { ...d, entities: { ...d.entities, [key]: rows } } : d));

  async function saveContent() {
    setContentSaving(true);
    setContentSaved(false);
    try {
      const res = await adminFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentDraft }),
      });
      if (!res.ok) throw new Error();
      setContentSaved(true);
      setData((d) => (d ? { ...d, content: contentDraft } : d));
      setTimeout(() => setContentSaved(false), 3000);
    } catch {
      alert("تعذر حفظ المحتوى");
    } finally {
      setContentSaving(false);
    }
  }

  async function savePassword() {
    setSettingsMsg("");
    try {
      const res = await adminFetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error();
      setData((prev) => (prev ? { ...prev, hasPassword: d.hasPassword } : prev));
      setNewPassword("");
      setSettingsMsg(
        d.hasPassword
          ? "تم تعيين كلمة المرور الجديدة بنجاح."
          : "تمت إزالة كلمة المرور — الدخول الآن بدون كلمة مرور."
      );
    } catch {
      setSettingsMsg("تعذر حفظ كلمة المرور.");
    }
  }

  async function logout() {
    await adminFetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    clearToken();
    window.location.reload();
  }

  if (loadError) {
    return (
      <div className="ink-surface grid min-h-screen place-items-center px-4">
        <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-8 py-6 text-center text-red-200">
          {loadError}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ink-surface grid min-h-screen place-items-center">
        <Loader2 size={36} className="animate-spin text-steel-400" />
      </div>
    );
  }

  const activeTab = TAB_DEFS.find((t) => t.key === tab) ?? TAB_DEFS[0];
  const entityConfig = ENTITY_CONFIGS.find((e) => e.key === tab);
  const newApps = data.applications.filter((a) => a.status === "new").length;
  const newMsgs = data.messages.filter((m) => m.status === "new").length;

  const stats = [
    { label: "مقال منشور", value: data.entities.articles?.length ?? 0, key: "articles", icon: Newspaper },
    { label: "فيديو / وسائط", value: data.entities.media?.length ?? 0, key: "media", icon: MonitorPlay },
    { label: "كتاب ومرجع", value: data.entities.books?.length ?? 0, key: "books", icon: BookOpen },
    { label: "خدمة قانونية", value: data.entities.services?.length ?? 0, key: "services", icon: Scale },
    { label: "طلبات تدريب جديدة", value: newApps, key: "applications", icon: GraduationCap },
    { label: "رسائل جديدة", value: newMsgs, key: "messages", icon: Inbox },
  ];

  return (
    <div className="flex min-h-screen bg-[#efe9da]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 end-0 z-[60] w-72 ink-surface transition-transform duration-500 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-steel-500/15 px-5 py-5">
            <div>
              <p className="font-display text-xl font-bold text-steel-100">لوحة التحكم</p>
              <p className="text-[11px] text-[#a9b6cd]">أ.د/ حسام لطفي — LAW FIRM</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="grid size-9 place-items-center rounded-lg border border-steel-500/30 text-steel-200 lg:hidden"
            >
              <X size={17} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3.5">
            {TAB_DEFS.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setSidebarOpen(false);
                }}
                className={cn("admin-tab", tab === t.key && "active")}
              >
                <t.icon size={17} className="shrink-0" />
                <span className="flex-1">{t.label}</span>
                {t.key === "applications" && newApps > 0 ? (
                  <span className="badge bg-steel-500 text-ink-950">{newApps}</span>
                ) : null}
                {t.key === "messages" && newMsgs > 0 ? (
                  <span className="badge bg-steel-500 text-ink-950">{newMsgs}</span>
                ) : null}
              </button>
            ))}
          </nav>

          <div className="space-y-2 border-t border-steel-500/15 p-3.5">
            <Link href="/" target="_blank" className="admin-tab">
              <ExternalLink size={16} />
              معاينة الموقع
            </Link>
            <button onClick={logout} className="admin-tab !text-red-300 hover:!text-red-200">
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-[55] bg-ink-950/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      ) : null}

      {/* Main */}
      <main className="min-w-0 flex-1 p-4 md:p-8">
        {/* Topbar */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid size-11 place-items-center rounded-lg border border-sand bg-white/80 text-ink-800 lg:hidden"
            >
              <Menu size={19} />
            </button>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{activeTab.label}</h1>
              <p className="text-xs text-muted">كل ما تنشره هنا يظهر مباشرة على الموقع</p>
            </div>
          </div>
          {tab === "content" ? (
            <button onClick={saveContent} disabled={contentSaving} className="btn btn-ink !py-2.5 !px-5 !text-sm disabled:opacity-60">
              {contentSaving ? <Loader2 size={16} className="animate-spin" /> : contentSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
              {contentSaved ? "تم الحفظ" : "حفظ المحتوى"}
            </button>
          ) : null}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" ? (
          <div className="space-y-7">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setTab(s.key)}
                  className="card-elegant flex items-center gap-4 p-5 text-start"
                >
                  <span className="grid size-13 shrink-0 place-items-center rounded-xl bg-ink-900 text-steel-300">
                    <s.icon size={22} />
                  </span>
                  <span>
                    <span className="font-display block text-3xl font-bold text-ink-900">{s.value}</span>
                    <span className="text-sm text-muted">{s.label}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-steel-500/30 bg-white/80 p-6">
              <h3 className="flex items-center gap-2 font-bold text-ink-900">
                <ShieldCheck size={18} className="text-steel-600" />
                حالة الأمان
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                {data.hasPassword
                  ? "لوحة التحكم محمية بكلمة مرور. يمكنك تغييرها أو إزالتها من تبويب «الإعدادات»."
                  : "لم يتم تعيين كلمة مرور بعد — أي شخص يصل لرابط /admin يمكنه الدخول مباشرة. يمكنك تعيين كلمة مرور من تبويب «الإعدادات»."}
              </p>
              <button onClick={() => setTab("settings")} className="btn btn-outline-ink mt-4 !py-2.5 !px-5 !text-sm">
                <KeyRound size={15} />
                إدارة كلمة المرور
              </button>
            </div>
          </div>
        ) : null}

        {/* Content */}
        {tab === "content" && contentDraft ? (
          <ContentEditor value={contentDraft} onChange={setContentDraft} />
        ) : null}

        {/* Entity collections */}
        {entityConfig ? (
          <CollectionManager
            config={entityConfig}
            rows={data.entities[entityConfig.key] ?? []}
            onRows={(rows) => updateEntityRows(entityConfig.key, rows)}
          />
        ) : null}

        {/* Submissions */}
        {tab === "applications" ? (
          <Submissions
            kind="applications"
            items={data.applications}
            onItems={(rows) => setData((d) => (d ? { ...d, applications: rows } : d))}
          />
        ) : null}
        {tab === "messages" ? (
          <Submissions
            kind="messages"
            items={data.messages}
            onItems={(rows) => setData((d) => (d ? { ...d, messages: rows } : d))}
          />
        ) : null}

        {/* Settings */}
        {tab === "settings" ? (
          <div className="max-w-xl space-y-6">
            <div className="rounded-xl border border-sand bg-white/85 p-7">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
                <KeyRound size={19} className="text-steel-600" />
                كلمة مرور لوحة التحكم
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                الحالة الحالية:{" "}
                <b className={data.hasPassword ? "text-green-700" : "text-steel-700"}>
                  {data.hasPassword ? "مُعينة — لوحة التحكم محمية" : "غير مُعينة — الدخول بدون كلمة مرور"}
                </b>
              </p>
              <div className="mt-5 space-y-3">
                <label className="field-label">
                  {data.hasPassword ? "كلمة مرور جديدة" : "تعيين كلمة مرور"}
                </label>
                <input
                  type="password"
                  className="admin-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={data.hasPassword ? "اتركها فارغة لإزالة كلمة المرور" : "اكتب كلمة المرور الجديدة"}
                />
                <p className="text-xs leading-6 text-muted">
                  اترك الحقل فارغًا ثم اضغط «حفظ» لإزالة كلمة المرور نهائيًا والرجوع للدخول المفتوح.
                </p>
                <button onClick={savePassword} className="btn btn-ink !py-2.5 !px-6 !text-sm">
                  <Save size={15} />
                  حفظ
                </button>
                {settingsMsg ? <p className="text-sm font-bold text-green-700">{settingsMsg}</p> : null}
              </div>
            </div>

            <div className="rounded-xl border border-sand bg-white/85 p-7">
              <h3 className="font-display text-xl font-bold text-ink-900">الجلسة</h3>
              <p className="mt-2 text-sm text-muted">تسجيل الخروج من لوحة التحكم على هذا الجهاز.</p>
              <button onClick={logout} className="btn btn-outline-ink mt-4 !py-2.5 !px-6 !text-sm">
                <LogOut size={15} />
                تسجيل الخروج
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
