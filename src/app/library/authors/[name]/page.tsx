import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/shell";
import { BookCover } from "@/components/book-cover";
import { listBooks } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AuthorPage({ params }: { params: Promise<{ name: string }> }) {
  const name = decodeURIComponent((await params).name);
  const books = (await listBooks()).filter((b) => b.author.trim() === name);
  if (books.length === 0) notFound();
  return (
    <SiteShell>
      <section className="ink-surface pt-36 pb-12 md:pt-44"><div className="container-x"><Link href="/library" className="text-sm text-steel-300">← المكتبة</Link><h1 className="font-display mt-3 text-3xl font-bold text-steel-100 md:text-5xl">{name}</h1><p className="mt-3 text-steel-200">{books.length} من المؤلفات في المكتبة</p></div></section>
      <section className="py-14 md:py-20"><div className="container-x grid grid-cols-2 gap-6 md:grid-cols-4">
        {books.map((b) => <Link key={b.id} href={`/library/${b.id}`}><BookCover title={b.title} category={b.category} year={b.year} note={b.note} /><span className="mt-3 block text-sm font-bold">{b.title}</span></Link>)}
      </div></section>
    </SiteShell>
  );
}
