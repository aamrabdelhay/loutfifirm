import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<string, { cover: string; band: string; ink: string }> = {
  civil: {
    cover: "from-[#1a2534] via-[#101825] to-[#060e1a]",
    band: "bg-steel-400",
    ink: "text-steel-100",
  },
  ip: {
    cover: "from-[#2e3742] via-[#23292e] to-[#14181d]",
    band: "bg-steel-300",
    ink: "text-steel-100",
  },
  translation: {
    cover: "from-[#16202d] via-[#101825] to-[#0a1322]",
    band: "bg-steel-500",
    ink: "text-steel-100",
  },
  french: {
    cover: "from-[#1a1e24] via-[#121519] to-[#0a0d10]",
    band: "bg-steel-400",
    ink: "text-steel-100",
  },
};

/** Elegant CSS-only book cover (real covers can be added later by the admin) */
export function BookCover({
  title,
  category,
  year,
  note,
  tall = false,
}: {
  title: string;
  category: string;
  year?: string;
  note?: string;
  tall?: boolean;
}) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.civil;
  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-md rounded-ss-sm shadow-[0_18px_36px_-14px_rgba(7,17,31,0.55)] transition-transform duration-500 hover:-translate-y-1.5 hover:rotate-[0.5deg]",
        tall ? "aspect-[3/4.3]" : "aspect-[3/4]"
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", style.cover)} />
      {/* spine */}
      <div className="absolute inset-y-0 start-0 w-[10px] bg-gradient-to-l from-black/45 to-transparent" />
      <div className="absolute inset-y-3 start-[10px] w-px bg-steel-400/30" />
      {/* ornament frame */}
      <div className="absolute inset-3 rounded-[3px] border border-steel-400/25 pointer-events-none" />
      <div className="relative flex h-full flex-col p-5 ps-7">
        <span className={cn("h-0.5 w-8 rounded-full", style.band)} />
        <h4
          className={cn(
            "font-display mt-3 flex-1 font-bold leading-relaxed line-clamp-5",
            style.ink,
            title.length > 40 ? "text-sm" : "text-base"
          )}
          dir={category === "french" ? "ltr" : "rtl"}
          style={category === "french" ? { textAlign: "left", fontFamily: "var(--font-latin)" } : undefined}
        >
          {title}
        </h4>
        {note ? (
          <span className="mb-2 inline-flex w-fit items-center rounded-full border border-steel-400/40 bg-steel-500/10 px-2.5 py-0.5 text-[10px] font-bold text-steel-300">
            {note}
          </span>
        ) : null}
        <div className="flex items-end justify-between">
          <span className="font-latin text-[10px] tracking-[0.25em] text-steel-400/70 uppercase">
            Dr. H. Loutfi
          </span>
          {year ? <span className="text-xs font-bold text-steel-300/90">{year}</span> : null}
        </div>
      </div>
      {/* sheen */}
      <div className="absolute inset-0 bg-gradient-to-l from-white/8 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}
