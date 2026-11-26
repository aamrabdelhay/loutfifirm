import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { BookCover } from "@/components/book-cover";
import { listBooks } from "@/lib/content";
import { BOOK_CATEGORIES } from "@/lib/default-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "المكتبة القانونية — أ.د/ حسام لطفي" };

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const books = (await listBooks()).filter((b) =>
    (!sp.category || b.category === sp.category) &&
    (!q || [b.title, b.description, b.note, b.year].some((v) => (v ?? "").toLowerCase().includes(q)))
  );
  const link = (category: string) => `/library${category ? `?category=${category}` : ""}`;
  return (
    <SiteShell>
      <PageHero label="المكتبة" title="المكتبة القانونية الرقمية" crumb="المكتبة" description="المؤلفات والمراجع القانونية المنشورة، مع بحث وتصنيف حسب المجال." />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <form action="/library" method="get" role="search" className="mb-6 flex max-w-xl gap-2">
            <input name="q" defaultValue={sp.q ?? ""} className="input" placeholder="ابحث باسم الكتاب أو وصفه" aria-label="بحث في المكتبة" />
            {sp.category ? <input type="hidden" name="category" value={sp.category} /> : null}
            <button className="btn btn-ink !px-5" type="submit"><Search size={16} />بحث</button>
          </form>
          <div className="mb-8 flex flex-wrap gap-2 text-sm">
            <Link href={link("")} className={`badge ${!sp.category ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>الكل</Link>
            {Object.entries(BOOK_CATEGORIES).map(([k, v]) => <Link key={k} href={link(k)} className={`badge ${sp.category === k ? "bg-ink-900 text-steel-100" : "border border-sand"}`}>{v}</Link>)}
          </div>
          {books.length === 0 ? <p className="py-16 text-center text-muted">لا توجد كتب مطابقة.</p> : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-7 lg:grid-cols-4">
              {books.map((b, i) => (
                <Reveal key={b.id} delay={Math.min(i * 50, 300)}>
                  <Link href={`/library/${b.id}`} className="block">
                    <BookCover title={b.title} category={b.category} year={b.year} note={b.note} />
                    <span className="mt-3 block text-sm font-bold text-ink-900">{b.title}</span>
                    <span className="block text-xs text-muted">{BOOK_CATEGORIES[b.category] ?? ""}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
