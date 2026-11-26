import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/shell";
import { YoutubeCard } from "@/components/youtube-card";
import { listMedia } from "@/lib/content";
import { MEDIA_KINDS } from "@/features/media/kinds";

export const dynamic = "force-dynamic";

async function find(id: string) {
  const n = Number(id);
  return Number.isInteger(n) ? (await listMedia()).find((m) => m.id === n) ?? null : null;
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const m = await find((await params).id);
  return m ? { title: `${m.title} — وسائط ومحاضرات`, description: m.description || undefined } : {};
}

export default async function MediaDetail({ params }: { params: Promise<{ id: string }> }) {
  const m = await find((await params).id);
  if (!m) notFound();
  const paragraphs = m.transcript.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  return (
    <SiteShell>
      <section className="ink-surface pt-36 pb-12 md:pt-44"><div className="container-x max-w-4xl">
        <Link href="/media" className="text-sm text-steel-300">← وسائط ومحاضرات</Link>
        <p className="mt-4 text-sm text-steel-200">{MEDIA_KINDS[m.kind] ?? m.kind}{m.event ? ` · ${m.event}` : ""}{m.location ? ` · ${m.location}` : ""}</p>
        <h1 className="font-display mt-2 text-3xl font-bold leading-[1.5] text-steel-100 md:text-4xl">{m.title}</h1>
      </div></section>
      <section className="py-12"><div className="container-x max-w-4xl space-y-8">
        <YoutubeCard url={m.url} title={m.title} source={m.source} dateLabel={m.dateLabel} large />
        {m.description ? <p className="leading-9 text-muted">{m.description}</p> : null}
        {paragraphs.length > 0 ? (
          <div><h2 className="font-display text-2xl font-bold text-ink-900">النص المكتوب</h2>
            <div className="mt-4 space-y-4">{paragraphs.map((p, i) => <p key={i} className="leading-[2.1] text-[#33415e]">{p}</p>)}</div></div>
        ) : null}
      </div></section>
    </SiteShell>
  );
}
