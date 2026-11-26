import type { EntityConfig } from "@/lib/admin-config";

export const intakeAdmin: EntityConfig = {
  key: "intake",
  title: "طلبات استقبال العملاء",
  singular: "طلب",
  titleField: "name",
  descField: "caseType",
  fields: [
    { key: "status", label: "الحالة (new / reviewing / contacted / closed)", type: "text" },
  ],
};
