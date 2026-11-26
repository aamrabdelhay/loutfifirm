import type { EntityConfig } from "@/lib/admin-config";

export const eventsAdmin: EntityConfig[] = [
  { key: "events", title: "الفعاليات والندوات", singular: "فعالية", titleField: "title", descField: "date", fields: [
    { key: "title", label: "العنوان", type: "text" },
    { key: "kind", label: "النوع (event أو webinar)", type: "text" },
    { key: "date", label: "التاريخ (YYYY-MM-DD)", type: "text" },
    { key: "time", label: "الوقت (HH:MM)", type: "text" },
    { key: "place", label: "المكان", type: "text" },
    { key: "link", label: "رابط الندوة أونلاين", type: "text" },
    { key: "description", label: "الوصف", type: "textarea", rows: 4 },
    { key: "capacity", label: "عدد المقاعد (0 = بدون حد)", type: "number" },
    { key: "published", label: "منشورة", type: "toggle" },
  ] },
  { key: "event_registrations", title: "المسجلون في الفعاليات", singular: "تسجيل", titleField: "name", descField: "email", fields: [
    { key: "eventId", label: "رقم الفعالية (ID)", type: "number" },
    { key: "name", label: "الاسم", type: "text" },
    { key: "email", label: "البريد", type: "text" },
    { key: "phone", label: "الهاتف", type: "text" },
  ] },
];
