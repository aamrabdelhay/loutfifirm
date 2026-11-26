import type { MetadataRoute } from "next";
import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { articles, books } from "@/db/schema";
import { sql } from "drizzle-orm";
import { isEmptyTable } from "@/features/seo/thin";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const STATIC = ["", "/about", "/services", "/academia", "/articles", "/media", "/library", "/awards", "/studies", "/training", "/faq", "/contact", "/intake", "/privacy", "/terms"];
// Listed only once the office has added content (empty pages are also noindex).
const OPTIONAL: [string, string][] = [["/events", "events"], ["/guides", "guides"], ["/glossary", "glossary"], ["/press", "press_releases"]];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.6 }));
  try {
    await ensureDb();
    for (const [path, table] of OPTIONAL) if (!(await isEmptyTable(table))) entries.push({ url: `${SITE_URL}${path}`, priority: 0.5 });
    const more: [string, string][] = [["/studies", "studies"], ["/guides", "guides"], ["/media", "media_items"]];
    for (const [base, table] of more) {
      const r = await db.execute(sql.raw(`SELECT id FROM ${table}${" WHERE published = true"}`));
      for (const row of r.rows as { id: number }[]) entries.push({ url: `${SITE_URL}${base}/${row.id}`, priority: 0.4 });
    }
    const [a, b] = await Promise.all([db.select({ id: articles.id }).from(articles), db.select({ id: books.id }).from(books)]);
    for (const x of a) entries.push({ url: `${SITE_URL}/articles/${x.id}`, priority: 0.5 });
    for (const x of b) entries.push({ url: `${SITE_URL}/library/${x.id}`, priority: 0.4 });
  } catch {
    // Database unreachable at crawl time: still serve the static routes.
  }
  return entries;
}
