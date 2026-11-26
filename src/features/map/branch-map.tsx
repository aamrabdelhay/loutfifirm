"use client";

import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

type Office = { name: string; lines: string[] };

/**
 * Branch map. Locations are searched by the published street address, so no
 * coordinates are hard-coded; if an address on the site changes, the map follows.
 */
export function BranchMap({ offices }: { offices: Office[] }) {
  const [active, setActive] = useState(0);
  const office = offices[active];
  if (!office) return null;
  const address = `${office.lines.join("، ")}، مصر`;
  const q = encodeURIComponent(address);
  return (
    <div className="card-elegant overflow-hidden">
      <div role="tablist" aria-label="الفروع" className="flex flex-wrap gap-2 border-b border-sand p-3">
        {offices.map((o, i) => (
          <button
            key={o.name}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${i === active ? "bg-ink-900 text-steel-100" : "text-ink-800 hover:bg-steel-500/10"}`}
          >
            <MapPin size={15} />
            {o.name}
          </button>
        ))}
      </div>
      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3 p-5">
          <h3 className="font-display text-xl font-bold text-ink-900">{office.name}</h3>
          {office.lines.map((l) => <p key={l} className="text-sm leading-7 text-muted">{l}</p>)}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ink mt-3 !px-5 !py-2.5 !text-sm"
          >
            <Navigation size={16} />
            طريقة الوصول
          </a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-steel-700 underline">
            فتح في خرائط جوجل
          </a>
        </div>
        <iframe
          key={office.name}
          title={`خريطة ${office.name}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="h-80 w-full border-0 lg:h-[26rem]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
