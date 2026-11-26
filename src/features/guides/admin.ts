import type { EntityConfig } from "@/lib/admin-config";

export const guidesAdmin: EntityConfig[] = [
  { key: "guides", title: "أدلة الحقوق", singular: "دليل", titleField: "title", descField: "summary", fields: [
    { key: "title", label: "العنوان", type: "text" },
    { key: "category", label: "التصنيف", type: "text" },
    { key: "summary", label: "ملخص", type: "textarea", rows: 2 },
    { key: "body", label: "نص الدليل (تفصل الفقرات بسطر فارغ)", type: "textarea", rows: 12 },
    { key: "published", label: "منشور", type: "toggle" },
  ] },
  { key: "glossary", title: "المصطلحات القانونية", singular: "مصطلح", titleField: "term", descField: "definition", fields: [
    { key: "term", label: "المصطلح", type: "text" },
    { key: "definition", label: "التعريف", type: "textarea", rows: 4 },
  ] },
];
