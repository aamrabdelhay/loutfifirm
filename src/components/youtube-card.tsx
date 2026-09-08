"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { youtubeEmbed, youtubeId, youtubeThumb, cn } from "@/lib/utils";

export function YoutubeCard({
  url,
  title,
  source,
  dateLabel,
  large = false,
}: {
  url: string;
  title: string;
  source?: string;
  dateLabel?: string;
  large?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const isYt = Boolean(youtubeId(url));

  if (playing && isYt) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl border border-steel-500/25 shadow-2xl">
        <iframe
          src={youtubeEmbed(url)}
          title={title}
          className="absolute inset-0 size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const thumb = isYt ? youtubeThumb(url) : "";

  return (
    <button
      type="button"
      onClick={() => (isYt ? setPlaying(true) : window.open(url, "_blank"))}
      className="group relative block w-full overflow-hidden rounded-xl border border-steel-500/20 bg-ink-950 text-start shadow-lg transition-all duration-500 hover:shadow-[0_25px_50px_-16px_rgba(201,162,39,0.35)] hover:border-steel-400/50"
    >
      <div className={cn("relative overflow-hidden", large ? "aspect-video" : "aspect-video")}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={title}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid size-full place-items-center ink-surface">
            <ExternalLink className="text-steel-400" size={36} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/25 to-transparent" />
        {/* play button */}
        <span className="absolute inset-0 grid place-items-center">
          <span className="relative grid place-items-center size-16 rounded-full bg-steel-500/90 text-ink-950 shadow-[0_0_0_8px_rgba(201,162,39,0.25)] transition-all duration-500 group-hover:scale-110 group-hover:bg-steel-400">
            <Play size={26} className="-translate-x-0.5" fill="currentColor" />
          </span>
        </span>
      </div>
      <span className="absolute inset-x-0 bottom-0 p-4">
        <span className="flex items-center gap-2 text-[11px] text-steel-300 mb-1.5">
          {source ? <span className="badge bg-steel-500/15 border border-steel-500/30">{source}</span> : null}
          {dateLabel ? <span className="text-[#b9c4da]">{dateLabel}</span> : null}
        </span>
        <span className={cn(
          "block font-bold text-steel-50 leading-relaxed transition-colors group-hover:text-steel-200",
          large ? "text-lg md:text-xl" : "text-sm md:text-[0.95rem]"
        )}>
          {title}
        </span>
      </span>
    </button>
  );
}
