import type { EntityConfig } from "@/lib/admin-config";

export const studiesAdmin: EntityConfig = {
  key: "studies",
  title: "الدراسات والقضايا",
  singular: "دراسة",
  titleField: "title",
  descField: "kind",
  fields: [
    { key: "title", label: "العنوان", type: "text" },
    { key: "kind", label: "النوع", type: "select", options: [
      { value: "study", label: "دراسة قانونية" }, { value: "research", label: "بحث" },
      { value: "analysis", label: "تحليل قانوني" }, { value: "case", label: "دراسة حالة" },
    ] },
    { key: "year", label: "السنة", type: "text" },
    { key: "summary", label: "ملخص", type: "textarea", rows: 3 },
    { key: "content", label: "النص الكامل", type: "textarea", rows: 12 },
    { key: "fileUrl", label: "رابط ملف PDF (اختياري)", type: "text", hint: "رابط يبدأ بـ https://" },
    { key: "published", label: "منشور على الموقع", type: "toggle" },
    { key: "sort", label: "الترتيب", type: "number" },
  ],
};
