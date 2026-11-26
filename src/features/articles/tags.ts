/** Tags are stored as one comma-separated string so the existing editor keeps working. */
export function parseTags(raw: string | null | undefined): string[] {
  return Array.from(new Set((raw ?? "").split(/[,،\n]/).map((t) => t.trim()).filter(Boolean)));
}

/** Higher score = more related. Shared category counts 2, each shared tag counts 1. */
export function relatedScore(
  a: { category: string; tags: string | null },
  b: { category: string; tags: string | null }
): number {
  const ta = new Set(parseTags(a.tags).map((t) => t.toLowerCase()));
  let score = a.category && a.category === b.category ? 2 : 0;
  for (const t of parseTags(b.tags)) if (ta.has(t.toLowerCase())) score += 1;
  return score;
}
