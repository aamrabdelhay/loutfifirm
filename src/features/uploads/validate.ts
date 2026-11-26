export const MAX_BYTES = 4 * 1024 * 1024;
export const ALLOWED: Record<string, { ext: string[]; magic: number[][] }> = {
  "application/pdf": { ext: ["pdf"], magic: [[0x25, 0x50, 0x44, 0x46]] },
  "image/jpeg": { ext: ["jpg", "jpeg"], magic: [[0xff, 0xd8, 0xff]] },
  "image/png": { ext: ["png"], magic: [[0x89, 0x50, 0x4e, 0x47]] },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { ext: ["docx"], magic: [[0x50, 0x4b, 0x03, 0x04]] },
};

export function uploadsEnabled(): boolean {
  return process.env.UPLOADS_ENABLED === "1";
}

/** Checks size, the declared type, the extension and the file's first bytes. Never trusts the client's type alone. */
export function validateFile(name: string, declaredType: string, bytes: Uint8Array): { ok: true; mime: string } | { ok: false; error: string } {
  if (bytes.length === 0) return { ok: false, error: "الملف فارغ" };
  if (bytes.length > MAX_BYTES) return { ok: false, error: "الحجم الأقصى 4 ميجابايت" };
  const rule = ALLOWED[declaredType];
  if (!rule) return { ok: false, error: "نوع الملف غير مسموح (PDF أو JPG أو PNG أو DOCX)" };
  const ext = name.toLowerCase().split(".").pop() ?? "";
  if (!rule.ext.includes(ext)) return { ok: false, error: "امتداد الملف لا يطابق نوعه" };
  if (!rule.magic.some((m) => m.every((b, i) => bytes[i] === b))) return { ok: false, error: "محتوى الملف لا يطابق نوعه" };
  return { ok: true, mime: declaredType };
}

export function safeName(name: string): string {
  return name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120) || "file";
}
