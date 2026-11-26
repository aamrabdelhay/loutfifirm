/** A short excerpt of `text` around the first match of `q`, or "" when there is none. */
export function snippet(text: string, q: string, radius = 70): string {
  const needle = q.trim().toLowerCase();
  if (!needle) return "";
  const i = text.toLowerCase().indexOf(needle);
  if (i < 0) return "";
  const start = Math.max(0, i - radius);
  const end = Math.min(text.length, i + needle.length + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).replace(/\s+/g, " ")}${end < text.length ? "…" : ""}`;
}
