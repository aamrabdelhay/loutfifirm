export type Lang = "ar" | "en" | "fr";
type L3 = Record<Lang, string>;

export const CASE_TYPES: { value: string; label: L3; docs: L3[] }[] = [
  {
    value: "IP",
    label: { ar: "الملكية الفكرية وحق المؤلف", en: "Intellectual property and copyright", fr: "Propriété intellectuelle et droit d'auteur" },
    docs: [
      { ar: "نسخة من العمل أو العلامة محل النزاع", en: "Copy of the work or mark concerned", fr: "Copie de l'œuvre ou de la marque concernée" },
      { ar: "عقود أو تراخيص سابقة", en: "Earlier contracts or licences", fr: "Contrats ou licences antérieurs" },
      { ar: "ما يثبت الملكية أو التسجيل", en: "Proof of ownership or registration", fr: "Preuve de titularité ou d'enregistrement" },
      { ar: "مراسلات أو أدلة على التعدي", en: "Correspondence or evidence of infringement", fr: "Correspondance ou preuves de contrefaçon" },
    ],
  },
  {
    value: "CIVIL",
    label: { ar: "قضايا مدنية وعقود", en: "Civil matters and contracts", fr: "Affaires civiles et contrats" },
    docs: [
      { ar: "العقد أو المحرر محل النزاع", en: "The contract or document in dispute", fr: "Le contrat ou document litigieux" },
      { ar: "إنذارات أو مراسلات رسمية", en: "Formal notices or correspondence", fr: "Mises en demeure ou correspondance officielle" },
      { ar: "صور بطاقات الهوية للأطراف", en: "ID copies of the parties", fr: "Copies d'identité des parties" },
      { ar: "أحكام أو محاضر سابقة", en: "Earlier judgments or records", fr: "Jugements ou procès-verbaux antérieurs" },
    ],
  },
  {
    value: "ARBITRATION",
    label: { ar: "التحكيم", en: "Arbitration", fr: "Arbitrage" },
    docs: [
      { ar: "اتفاق التحكيم أو شرطه", en: "Arbitration agreement or clause", fr: "Convention ou clause d'arbitrage" },
      { ar: "العقد الأصلي", en: "The underlying contract", fr: "Le contrat sous-jacent" },
      { ar: "طلب التحكيم أو الرد عليه إن وُجد", en: "Request for arbitration or response, if any", fr: "Demande d'arbitrage ou réponse, le cas échéant" },
    ],
  },
  {
    value: "ACADEMIC",
    label: { ar: "رأي أو بحث قانوني", en: "Legal opinion or research", fr: "Avis ou recherche juridique" },
    docs: [
      { ar: "المسألة محل الرأي أو البحث", en: "The question to be examined", fr: "La question à examiner" },
      { ar: "المستندات ذات الصلة", en: "Relevant documents", fr: "Documents pertinents" },
    ],
  },
  {
    value: "OTHER",
    label: { ar: "أخرى", en: "Other", fr: "Autre" },
    docs: [
      { ar: "أي مستندات متعلقة بالموضوع", en: "Any documents related to the matter", fr: "Tout document lié à l'affaire" },
    ],
  },
];

export const URGENCY: { value: string; label: L3 }[] = [
  { value: "normal", label: { ar: "عادي", en: "Normal", fr: "Normal" } },
  { value: "urgent", label: { ar: "مستعجل", en: "Urgent", fr: "Urgent" } },
  { value: "critical", label: { ar: "عاجل جدًا (جلسة أو ميعاد قريب)", en: "Very urgent (hearing or deadline close)", fr: "Très urgent (audience ou délai proche)" } },
];

export const CASE_TYPE_VALUES = CASE_TYPES.map((c) => c.value);
export const URGENCY_VALUES = URGENCY.map((u) => u.value);
