import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import {
  siteContent,
  articles,
  mediaItems,
  books,
  services,
  faqs,
  timelineItems,
  awards,
  applications,
  messages,
} from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { DEFAULT_CONTENT, type SiteContent } from "./default-content";
import { deepMerge } from "./utils";

export async function getContent(): Promise<SiteContent> {
  await ensureDb();
  const rows = await db.select().from(siteContent).where(eq(siteContent.id, 1));
  return deepMerge(DEFAULT_CONTENT, rows[0]?.data);
}

export async function saveContent(data: unknown) {
  await ensureDb();
  await db
    .insert(siteContent)
    .values({ id: 1, data: data as object })
    .onConflictDoUpdate({ target: siteContent.id, set: { data: data as object } });
}

export async function listArticles(publishedOnly = true) {
  await ensureDb();
  const rows = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return publishedOnly ? rows.filter((r) => r.published) : rows;
}

export async function getArticleById(id: number) {
  await ensureDb();
  const rows = await db.select().from(articles).where(eq(articles.id, id));
  return rows[0] ?? null;
}

export async function listMedia(publishedOnly = true) {
  await ensureDb();
  const rows = await db.select().from(mediaItems).orderBy(desc(mediaItems.createdAt));
  return publishedOnly ? rows.filter((r) => r.published) : rows;
}

export async function listBooks() {
  await ensureDb();
  return db.select().from(books).orderBy(asc(books.sort), asc(books.id));
}

export async function listServices(publishedOnly = true) {
  await ensureDb();
  const rows = await db.select().from(services).orderBy(asc(services.sort), asc(services.id));
  return publishedOnly ? rows.filter((r) => r.published) : rows;
}

export async function listFaqs(publishedOnly = true) {
  await ensureDb();
  const rows = await db.select().from(faqs).orderBy(asc(faqs.sort), asc(faqs.id));
  return publishedOnly ? rows.filter((r) => r.published) : rows;
}

export async function listTimeline() {
  await ensureDb();
  return db.select().from(timelineItems).orderBy(asc(timelineItems.sort), asc(timelineItems.id));
}

export async function listAwards() {
  await ensureDb();
  return db.select().from(awards).orderBy(asc(awards.sort), asc(awards.id));
}

export async function listApplications() {
  await ensureDb();
  return db.select().from(applications).orderBy(desc(applications.createdAt));
}

export async function listMessages() {
  await ensureDb();
  return db.select().from(messages).orderBy(desc(messages.createdAt));
}
