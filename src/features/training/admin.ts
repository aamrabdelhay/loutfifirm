import type { EntityConfig } from "@/lib/admin-config";

export const trainingAdmin: EntityConfig[] = [
  { key: "training_groups", title: "مجموعات التدريب", singular: "مجموعة", titleField: "name", descField: "notes", fields: [
    { key: "name", label: "اسم المجموعة", type: "text" },
    { key: "accessCode", label: "كود دخول المجموعة", type: "text", hint: "اكتب كودًا عشوائيًا طويلًا (16 حرفًا على الأقل). بعد الحفظ يُخزَّن مشفرًا ولا يمكن عرضه، فاحتفظ به وشاركه مع المتدربين فقط. عند تعديل بيانات أخرى للمجموعة اترك هذا الحقل كما هو." },
    { key: "notes", label: "ملاحظات", type: "textarea", rows: 2 },
    { key: "active", label: "المجموعة نشطة", type: "toggle" },
  ] },
  { key: "training_sessions", title: "محاضرات التدريب", singular: "محاضرة", titleField: "title", descField: "date", fields: [
    { key: "groupId", label: "رقم المجموعة (ID)", type: "number" },
    { key: "title", label: "عنوان المحاضرة", type: "text" },
    { key: "date", label: "التاريخ (YYYY-MM-DD)", type: "text" },
    { key: "time", label: "الوقت (HH:MM)", type: "text" },
    { key: "place", label: "المكان", type: "text" },
    { key: "notes", label: "ملاحظات", type: "textarea", rows: 2 },
  ] },
  { key: "training_assignments", title: "تكليفات التدريب", singular: "تكليف", titleField: "title", descField: "dueDate", fields: [
    { key: "groupId", label: "رقم المجموعة (ID)", type: "number" },
    { key: "title", label: "عنوان التكليف", type: "text" },
    { key: "description", label: "الوصف", type: "textarea", rows: 4 },
    { key: "dueDate", label: "موعد التسليم (YYYY-MM-DD)", type: "text" },
  ] },
  { key: "training_attendance", title: "حضور المتدربين", singular: "سجل حضور", titleField: "traineeName", fields: [
    { key: "sessionId", label: "رقم المحاضرة (ID)", type: "number" },
    { key: "traineeName", label: "اسم المتدرب", type: "text" },
    { key: "present", label: "حاضر", type: "toggle" },
  ] },
];
