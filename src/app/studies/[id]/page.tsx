import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/shell";
import { listStudies } from "@/features/studies/queries";
import { STUDY_KINDS } from "@/features/studies/schema";

export const dynamic = "force-dynamic";

async function find(id: string) {
  const n = Number(id);
  return Number.isInteger(n) ? (await listStudies()).find((s) => s.id === n) ?? null : null;
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const s = await find((await params).id);
  return s ? { title: `${s.title} — الدراسات القانونية`, description: s.summary || undefined } : {};
}

export default async function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const s = await find((await params).id);
  if (!s) notFound();
  const file = /^https?:\/\//i.test(s.fileUrl) ? s.fileUrl : "";
  const paragraphs = s.content.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  return (
    <SiteShell>
      <section className="ink-surface pt-36 pb-12 md:pt-44"><div className="container-x max-w-3xl">
        <Link href="/studies" className="text-sm text-steel-300">← الدراسات</Link>
        <p className="mt-4 text-sm text-steel-200">{STUDY_KINDS[s.kind] ?? s.kind}{s.year ? ` · ${s.year}` : ""}</p>
        <h1 className="font-display mt-2 text-3xl font-bold leading-[1.5] text-steel-100 md:text-5xl">{s.title}</h1>
        {s.summary ? <p className="mt-4 leading-9 text-[#c6cfdf]">{s.summary}</p> : null}
      </div></section>
      <section className="py-14"><div className="container-x max-w-3xl space-y-6">
        {paragraphs.map((p, i) => <p key={i} className="leading-[2.2] text-[#33415e]">{p}</p>)}
        {file ? <a href={file} target="_blank" rel="noopener noreferrer" className="btn btn-ink"><ExternalLink size={16} />تحميل الملف</a> : null}
      </div></section>
    </SiteShell>
  );
}
