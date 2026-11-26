/** Egyptian mobile: 01[0125] + 8 digits (11 digits), optionally prefixed by +20 / 0020 / 20. */
export function normalizeDigits(v: string): string {
  return (v ?? "").replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x660)).replace(/[^\d+]/g, "");
}
export function isValidEgyptMobile(v: string): boolean {
  const d = normalizeDigits(v).replace(/^\+?(00)?20/, "0");
  return /^01[0125]\d{8}$/.test(d);
}
/** A mobile-labelled entry is checked; other numbers (landlines) are left as they are. */
export function isMobileLabel(label: string): boolean {
  return /محمول|موبايل|mobile|cell/i.test(label);
}
/** Number the call button may dial: confirmed callNumber first, else a valid mobile, else none. */
export function dialableNumber(callNumber: string | undefined, mobile: string | undefined): string | null {
  for (const c of [callNumber, mobile]) {
    if (c && isValidEgyptMobile(c)) return normalizeDigits(c).replace(/^\+?(00)?20/, "0");
  }
  return null;
}
/** True when the phones list already shows this mobile (same digits), so it is not printed twice. */
export function hasPhone(phones: { value: string }[], mobile: string | undefined): boolean {
  const m = normalizeDigits(mobile ?? "");
  return !!m && phones.some((p) => normalizeDigits(p.value) === m);
}

type ContactLike = { mobile?: string; callNumber?: string; phones?: { label: string; value: string }[] };

/** Every number the office may have typed as its mobile: the mobile field plus mobile-labelled entries of the phones list. */
export function mobileCandidates(c: ContactLike): string[] {
  return [c.mobile ?? "", ...(c.phones ?? []).filter((p) => isMobileLabel(p.label)).map((p) => p.value)].map((x) => x.trim()).filter(Boolean);
}

/** The mobile to display: the first valid candidate, otherwise the first one typed (shown with the red frame). */
export function effectiveMobile(c: ContactLike): string {
  const list = mobileCandidates(c);
  return list.find(isValidEgyptMobile) ?? list[0] ?? "";
}

/** Dialable number for the call button, from the confirmed call number or any valid mobile. */
export function dialableFromContact(c: ContactLike): string | null {
  return dialableNumber(c.callNumber, effectiveMobile(c));
}
