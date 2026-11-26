import type { EntityConfig } from "@/lib/admin-config";

export const pressAdmin: EntityConfig[] = [
  { key: "press_releases", title: "البيانات الصحفية", singular: "بيان", titleField: "title", descField: "date", fields: [
    { key: "title", label: "العنوان", type: "text" },
    { key: "date", label: "التاريخ (YYYY-MM-DD)", type: "text" },
    { key: "summary", label: "ملخص", type: "textarea", rows: 2 },
    { key: "body", label: "النص الكامل", type: "textarea", rows: 10 },
    { key: "pdfLink", label: "رابط ملف PDF (اختياري)", type: "text" },
    { key: "published", label: "منشور", type: "toggle" },
  ] },
];
