import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/shell";
import { Reveal } from "@/components/ui";
import { BookCover } from "@/components/book-cover";
import { listBooks } from "@/lib/content";
import { BOOK_CATEGORIES } from "@/lib/default-content";

export const dynamic = "force-dynamic";

async function find(id: string) {
  const n = Number(id);
  if (!Number.isInteger(n)) return null;
  return (await listBooks()).find((b) => b.id === n) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const b = await find((await params).id);
  return b ? { title: `${b.title} — المكتبة القانونية`, description: b.description || undefined } : {};
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const book = await find((await params).id);
  if (!book) notFound();
  const safeLink = /^https?:\/\//i.test(book.link) ? book.link : "";
  const rows: [string, string][] = [
    ["المؤلف", book.author], ["الناشر", book.publisher], ["سنة / طبعة", book.year], ["الرقم الدولي ISBN", book.isbn], ["القسم", BOOK_CATEGORIES[book.category] ?? ""],
  ];
  return (
    <SiteShell>
      <section className="ink-surface pt-36 pb-12 md:pt-44"><div className="container-x"><Link href="/library" className="text-sm text-steel-300">← المكتبة</Link><h1 className="font-display mt-3 text-3xl font-bold text-steel-100 md:text-5xl">{book.title}</h1></div></section>
      <section className="py-14 md:py-20">
        <div className="container-x grid gap-10 md:grid-cols-[260px_1fr]">
          <Reveal><BookCover title={book.title} category={book.category} year={book.year} note={book.note} /></Reveal>
          <Reveal>
            {book.description ? <p className="text-base leading-9 text-[#33415e]">{book.description}</p> : null}
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {rows.filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-sand bg-white/60 p-4"><dt className="text-xs text-muted">{k}</dt><dd className="mt-1 font-bold text-ink-900">
                  {k === "المؤلف" ? <Link className="underline" href={`/library/authors/${encodeURIComponent(v)}`}>{v}</Link> : v}</dd></div>
              ))}
            </dl>
            {safeLink ? <a href={safeLink} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-8"><ExternalLink size={16} />رابط الكتاب</a> : null}
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
