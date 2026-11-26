import type { EntityConfig } from "@/lib/admin-config";
import { studiesAdmin } from "./studies/admin";
import { trainingAdmin } from "./training/admin";
import { eventsAdmin } from "./events/admin";
import { guidesAdmin } from "./guides/admin";
import { pressAdmin } from "./press/admin";
import { intakeAdmin } from "./intake/admin";

/** Client-safe registry: admin tabs and public links contributed by feature modules. */
export const FEATURE_ADMIN_CONFIGS: EntityConfig[] = [
  intakeAdmin,
  studiesAdmin,
  ...trainingAdmin,
  ...eventsAdmin,
  ...guidesAdmin,
  ...pressAdmin,
  // FEATURE-REGISTRY:ADMIN (do not remove this marker)
];

/** Extra public pages listed in the footer. */
export const FEATURE_LINKS: { href: string; label: string }[] = [
  { href: "/intake", label: "استقبال العملاء" },
  { href: "/library", label: "المكتبة القانونية" },
  { href: "/studies", label: "الدراسات القانونية" },
  { href: "/awards", label: "الجوائز والعضويات" },
  { href: "/training/portal", label: "بوابة المتدربين" },
  { href: "/events", label: "الفعاليات" },
  { href: "/guides", label: "أدلة الحقوق" },
  { href: "/press", label: "البيانات الصحفية" },
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "الشروط والأحكام" },
  // FEATURE-REGISTRY:LINKS (do not remove this marker)
];
