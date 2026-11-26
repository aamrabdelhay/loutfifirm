export type Lang = "ar" | "en" | "fr";

/** Branch ids used by the office system (office_branches.id), in the same order as contact.offices. */
export const BRANCH_IDS = ["branch_main", "branch_cairo", "branch_giza"] as const;
export type BranchId = (typeof BRANCH_IDS)[number];

export const MODES = ["office", "phone", "video"] as const;
export type Mode = (typeof MODES)[number];

export const MODE_LABELS: Record<Mode, Record<Lang, string>> = {
  office: { ar: "حضوري في المكتب", en: "In person at the office", fr: "En personne au cabinet" },
  phone: { ar: "مكالمة هاتفية", en: "Phone call", fr: "Appel téléphonique" },
  video: { ar: "مكالمة فيديو", en: "Video call", fr: "Appel vidéo" },
};

export const TYPE_VALUES = ["LEGAL_CONSULTATION", "CASE_FOLLOW_UP", "OTHER"] as const;
