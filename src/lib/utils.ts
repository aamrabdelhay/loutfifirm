export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Extract a YouTube video ID from almost any YouTube URL format */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*v=)([A-Za-z0-9_-]{6,15})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{6,15})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{6,15})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,15})/,
    /(?:youtube\.com\/live\/)([A-Za-z0-9_-]{6,15})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  // Raw ID fallback
  if (/^[A-Za-z0-9_-]{6,15}$/.test(url.trim())) return url.trim();
  return null;
}

export function youtubeThumb(url: string): string {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

export function youtubeEmbed(url: string): string {
  const id = youtubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : "";
}

const AR_DATE = new Intl.DateTimeFormat("ar-EG", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatArDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return AR_DATE.format(d);
}

/** Simple deep-merge of data over defaults (objects only, arrays replaced) */
export function deepMerge<T>(defaults: T, data: unknown): T {
  if (data === null || data === undefined) return defaults;
  if (Array.isArray(defaults)) return (data as T) ?? defaults;
  if (typeof defaults === "object" && defaults !== null) {
    if (typeof data !== "object" || data === null || Array.isArray(data))
      return defaults;
    const out: Record<string, unknown> = {};
    const defObj = defaults as Record<string, unknown>;
    const dataObj = data as Record<string, unknown>;
    for (const key of Object.keys(defObj)) {
      out[key] = deepMerge(defObj[key], dataObj[key]);
    }
    // keep unknown extra keys from data
    for (const key of Object.keys(dataObj)) {
      if (!(key in defObj)) out[key] = dataObj[key];
    }
    return out as T;
  }
  return (data as T) ?? defaults;
}
