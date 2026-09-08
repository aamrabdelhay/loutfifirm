export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن الدكتور" },
  { href: "/services", label: "الخدمات القانونية" },
  { href: "/academia", label: "الأكاديمية والبحث" },
  { href: "/articles", label: "المقالات" },
  { href: "/media", label: "وسائط ومحاضرات" },
  { href: "/training", label: "التدريب" },
  { href: "/faq", label: "اسألنا" },
  { href: "/contact", label: "تواصل معنا" },
] as const;

export const YEAR_OPTIONS = [
  "الفرقة الأولى",
  "الفرقة الثانية",
  "الفرقة الثالثة",
  "الفرقة الرابعة",
  "خريج",
  "طالب دراسات عليا",
] as const;

export const INQUIRY_TYPES = [
  "استشارة قانونية",
  "قضية ملكية فكرية",
  "تحكيم دولي",
  "بحث أكاديمي",
  "أخرى",
] as const;
