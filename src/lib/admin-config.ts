import { BOOK_CATEGORIES } from "./default-content";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "toggle"
  | "select"
  | "image"
  | "list";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  rows?: number;
  hint?: string;
};

export type EntityConfig = {
  key: string;
  title: string;
  singular: string;
  titleField: string;
  descField?: string;
  fields: FieldConfig[];
};

export const ENTITY_CONFIGS: EntityConfig[] = [
  {
    key: "articles",
    title: "المقالات والآراء",
    singular: "مقال",
    titleField: "title",
    descField: "category",
    fields: [
      { key: "title", label: "عنوان المقال", type: "text" },
      { key: "category", label: "التصنيف", type: "text", placeholder: "الملكية الفكرية" },
      { key: "excerpt", label: "مقتطف قصير", type: "textarea", rows: 2 },
      { key: "content", label: "نص المقال الكامل", type: "textarea", rows: 12 },
      { key: "image", label: "رابط صورة المقال", type: "image" },
      { key: "published", label: "منشور على الموقع", type: "toggle" },
    ],
  },
  {
    key: "media",
    title: "الوسائط والمحاضرات",
    singular: "فيديو",
    titleField: "title",
    descField: "source",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "description", label: "الوصف", type: "textarea", rows: 3 },
      { key: "source", label: "المصدر / القناة", type: "text", placeholder: "إكسترا نيوز" },
      { key: "dateLabel", label: "السنة / التاريخ", type: "text", placeholder: "2024" },
      {
        key: "type",
        label: "النوع",
        type: "select",
        options: [
          { value: "youtube", label: "فيديو يوتيوب" },
          { value: "link", label: "رابط خارجي" },
        ],
      },
      {
        key: "url",
        label: "رابط الفيديو (يوتيوب) أو الرابط الخارجي",
        type: "text",
        hint: "الصق رابط يوتيوب وسيتم سحب صورة الفيديو تلقائيًا وتشغيله داخل الموقع",
      },
      { key: "published", label: "منشور على الموقع", type: "toggle" },
    ],
  },
  {
    key: "books",
    title: "المؤلفات والكتب",
    singular: "كتاب",
    titleField: "title",
    descField: "category",
    fields: [
      { key: "title", label: "اسم الكتاب", type: "text" },
      {
        key: "category",
        label: "القسم",
        type: "select",
        options: Object.entries(BOOK_CATEGORIES).map(([value, label]) => ({ value, label })),
      },
      { key: "description", label: "الوصف", type: "textarea", rows: 3 },
      { key: "year", label: "سنة / طبعة", type: "text", placeholder: "2026" },
      { key: "note", label: "ملاحظة (تظهر على الغلاف)", type: "text", placeholder: "جائزة الدولة التشجيعية" },
      { key: "featured", label: "كتاب بارز", type: "toggle" },
      { key: "sort", label: "الترتيب", type: "number" },
    ],
  },
  {
    key: "services",
    title: "الخدمات القانونية",
    singular: "خدمة",
    titleField: "title",
    descField: "summary",
    fields: [
      { key: "title", label: "اسم الخدمة", type: "text" },
      { key: "summary", label: "ملخص قصير (يظهر في الرئيسية)", type: "textarea", rows: 2 },
      { key: "paragraph", label: "فقرة تعريفية", type: "textarea", rows: 4 },
      { key: "audience", label: "من نخدم في هذا المجال؟", type: "list" },
      { key: "items", label: "ماذا نقدم؟ (بنود الخدمة)", type: "list" },
      { key: "note", label: "ملاحظة مميزة", type: "textarea", rows: 2 },
      { key: "published", label: "منشور على الموقع", type: "toggle" },
      { key: "sort", label: "الترتيب", type: "number" },
    ],
  },
  {
    key: "faqs",
    title: "الأسئلة الشائعة",
    singular: "سؤال",
    titleField: "question",
    fields: [
      { key: "question", label: "السؤال", type: "text" },
      { key: "answer", label: "الإجابة", type: "textarea", rows: 5 },
      { key: "published", label: "منشور على الموقع", type: "toggle" },
      { key: "sort", label: "الترتيب", type: "number" },
    ],
  },
  {
    key: "timeline",
    title: "المسيرة الزمنية",
    singular: "محطة",
    titleField: "title",
    descField: "yearLabel",
    fields: [
      { key: "yearLabel", label: "السنة / الفترة", type: "text", placeholder: "1987" },
      { key: "title", label: "العنوان", type: "text" },
      { key: "description", label: "الوصف", type: "textarea", rows: 2 },
      { key: "sort", label: "الترتيب", type: "number" },
    ],
  },
  {
    key: "awards",
    title: "الجوائز والتكريمات",
    singular: "جائزة",
    titleField: "title",
    descField: "year",
    fields: [
      { key: "year", label: "السنة", type: "text", placeholder: "1987" },
      { key: "title", label: "اسم الجائزة / التكريم", type: "text" },
      { key: "description", label: "الوصف", type: "textarea", rows: 3 },
      { key: "sort", label: "الترتيب", type: "number" },
    ],
  },
];

/** Sections of the editable site-content document, rendered as forms in the admin */
export type ContentField = {
  path: string;
  label: string;
  type: FieldType;
  rows?: number;
  hint?: string;
};

export type ContentSection = {
  key: string;
  title: string;
  description?: string;
  fields: ContentField[];
  /** object-list editors: path -> array of objects with these subfields */
  objectLists?: {
    path: string;
    label: string;
    subfields: { key: string; label: string }[];
  }[];
};

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    key: "general",
    title: "الهوية العامة",
    description: "اسم الموقع والشعار وأزرار الهيدر",
    fields: [
      { path: "general.siteName", label: "الاسم (عربي)", type: "text" },
      { path: "general.siteNameEn", label: "الاسم (إنجليزي)", type: "text" },
      { path: "general.tagline", label: "الوصف المختصر (تحت الاسم)", type: "text" },
      { path: "general.headerCta", label: "نص زر الهيدر", type: "text" },
    ],
  },
  {
    key: "hero",
    title: "الواجهة الرئيسية (Hero)",
    description: "أول ما يراه الزائر في أعلى الصفحة الرئيسية",
    fields: [
      { path: "hero.badge", label: "الشارة العلوية", type: "text" },
      { path: "hero.prefix", label: "السطر فوق الاسم", type: "text" },
      { path: "hero.name", label: "الاسم الكبير", type: "text" },
      { path: "hero.titles", label: "الألقاب (كل لقب في سطر)", type: "list" },
      { path: "hero.description", label: "الوصف", type: "textarea", rows: 4 },
      { path: "hero.ctaPrimary", label: "الزر الرئيسي", type: "text" },
      { path: "hero.ctaSecondary", label: "الزر الثانوي", type: "text" },
      { path: "hero.image", label: "صورة البورتريه (رابط)", type: "image", hint: "يمكنك وضع رابط صورة حقيقية للدكتور هنا" },
      { path: "hero.imageCaption", label: "تعليق أسفل الصورة", type: "text" },
    ],
  },
  {
    key: "stats",
    title: "الأرقام والإحصائيات",
    description: "شريط الأرقام في الصفحة الرئيسية",
    fields: [],
    objectLists: [
      {
        path: "stats",
        label: "إحصائية",
        subfields: [
          { key: "value", label: "الرقم (مثال: +40)" },
          { key: "label", label: "الوصف (مثال: عامًا من الخبرة)" },
        ],
      },
    ],
  },
  {
    key: "why",
    title: "قسم «لماذا الدكتور؟»",
    fields: [
      { path: "why.label", label: "التسمية الصغيرة", type: "text" },
      { path: "why.title", label: "العنوان", type: "text" },
      { path: "why.paragraph", label: "الفقرة", type: "textarea", rows: 4 },
    ],
    objectLists: [
      {
        path: "why.features",
        label: "ميزة",
        subfields: [
          { key: "title", label: "العنوان" },
          { key: "text", label: "الوصف" },
        ],
      },
    ],
  },
  {
    key: "specialties",
    title: "مجالات التخصص (الشريط المتحرك)",
    fields: [{ path: "specialties", label: "المجالات (واحدة في كل سطر)", type: "list" }],
  },
  {
    key: "cta",
    title: "دعوة التواصل (أسفل الرئيسية)",
    fields: [
      { path: "cta.title", label: "العنوان", type: "text" },
      { path: "cta.text", label: "النص", type: "textarea", rows: 3 },
      { path: "cta.button", label: "نص الزر", type: "text" },
    ],
  },
  {
    key: "about",
    title: "صفحة «عن الدكتور»",
    fields: [
      { path: "about.lead", label: "الفقرة الافتتاحية", type: "textarea", rows: 4 },
      { path: "about.bio", label: "فقرات السيرة الذاتية (فقرة في كل سطر)", type: "list" },
      { path: "about.educationIntro", label: "مقدمة جدول التعليم", type: "textarea", rows: 2 },
      { path: "about.thesis", label: "موضوع الدكتوراه", type: "textarea", rows: 2 },
      { path: "about.thesisFr", label: "العنوان الفرنسي", type: "text" },
      { path: "about.intlTitle", label: "عنوان القائمة الدولية", type: "text" },
      { path: "about.intl", label: "المناصب الدولية (سطر لكل منصب)", type: "list" },
      { path: "about.localTitle", label: "عنوان القائمة المحلية", type: "text" },
      { path: "about.local", label: "المناصب المحلية (سطر لكل منصب)", type: "list" },
    ],
    objectLists: [
      {
        path: "about.education",
        label: "مؤهل علمي",
        subfields: [
          { key: "year", label: "السنة" },
          { key: "degree", label: "الدرجة العلمية" },
          { key: "institution", label: "المؤسسة" },
        ],
      },
    ],
  },
  {
    key: "academia",
    title: "صفحة الأكاديمية",
    fields: [
      { path: "academia.intro", label: "الرسالة الأكاديمية", type: "textarea", rows: 4 },
      { path: "academia.researchIntro", label: "مقدمة الأبحاث", type: "textarea", rows: 3 },
      { path: "academia.topics", label: "موضوعات الأبحاث (سطر لكل موضوع)", type: "list" },
      { path: "academia.supervision", label: "فقرة الإشراف الأكاديمي", type: "textarea", rows: 3 },
      { path: "academia.supervisionCta", label: "دعوة الباحثين", type: "text" },
    ],
  },
  {
    key: "pages",
    title: "مقدمات الصفحات",
    fields: [
      { path: "pages.services", label: "صفحة الخدمات", type: "textarea", rows: 2 },
      { path: "pages.articles", label: "صفحة المقالات", type: "textarea", rows: 2 },
      { path: "pages.media", label: "صفحة الوسائط", type: "textarea", rows: 2 },
      { path: "pages.faq", label: "صفحة الأسئلة", type: "textarea", rows: 2 },
      { path: "pages.contact", label: "صفحة التواصل", type: "textarea", rows: 2 },
    ],
  },
  {
    key: "training",
    title: "صفحة التدريب",
    fields: [
      { path: "training.title", label: "العنوان", type: "text" },
      { path: "training.intro", label: "المقدمة", type: "textarea", rows: 3 },
      { path: "training.success", label: "رسالة النجاح بعد الإرسال", type: "text" },
    ],
  },
  {
    key: "contact",
    title: "بيانات التواصل والمكاتب",
    fields: [
      { path: "contact.email", label: "البريد الإلكتروني", type: "text" },
      { path: "contact.mobile", label: "محمول المكتب", type: "text" },
      { path: "contact.hours", label: "مواعيد العمل", type: "text" },
    ],
    objectLists: [
      {
        path: "contact.phones",
        label: "رقم / مجموعة أرقام",
        subfields: [
          { key: "label", label: "الوصف (مثال: تليفونات المقر)" },
          { key: "value", label: "الأرقام" },
        ],
      },
    ],
  },
  {
    key: "footer",
    title: "الفوتر",
    fields: [
      { path: "footer.description", label: "نبذة الفوتر", type: "textarea", rows: 3 },
      { path: "footer.note", label: "سطر الحقوق", type: "text" },
    ],
  },
];
