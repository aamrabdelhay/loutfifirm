import { db, pool } from "./index";
import {
  siteContent,
  adminAuth,
  assistantSettings,
  articles,
  mediaItems,
  books,
  services,
  faqs,
  timelineItems,
  awards,
} from "./schema";
import { count } from "drizzle-orm";
import {
  DEFAULT_CONTENT,
  SEED_ARTICLES,
  SEED_AWARDS,
  SEED_BOOKS,
  SEED_FAQS,
  SEED_MEDIA,
  SEED_SERVICES,
  SEED_TIMELINE,
} from "@/lib/default-content";

const DDL = `
CREATE TABLE IF NOT EXISTS site_content (
  id integer PRIMARY KEY,
  data jsonb NOT NULL
);
CREATE TABLE IF NOT EXISTS admin_auth (
  id integer PRIMARY KEY,
  password_hash text NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS assistant_settings (
  id integer PRIMARY KEY,
  api_key text NOT NULL DEFAULT '',
  model varchar(180) NOT NULL DEFAULT 'gpt-4o-mini',
  endpoint text NOT NULL DEFAULT 'https://api.openai.com/v1/chat/completions',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS articles (
  id serial PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category varchar(180) NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS media_items (
  id serial PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  source varchar(180) NOT NULL DEFAULT '',
  date_label varchar(60) NOT NULL DEFAULT '',
  type varchar(20) NOT NULL DEFAULT 'youtube',
  url text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS books (
  id serial PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category varchar(40) NOT NULL DEFAULT 'civil',
  year varchar(60) NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  sort integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS services (
  id serial PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  paragraph text NOT NULL DEFAULT '',
  icon varchar(60) NOT NULL DEFAULT 'Scale',
  audience jsonb NOT NULL DEFAULT '[]',
  items jsonb NOT NULL DEFAULT '[]',
  note text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  sort integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS faqs (
  id serial PRIMARY KEY,
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT true,
  sort integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS timeline_items (
  id serial PRIMARY KEY,
  year_label varchar(80) NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS awards (
  id serial PRIMARY KEY,
  year varchar(60) NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  icon varchar(60) NOT NULL DEFAULT 'Trophy',
  sort integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS applications (
  id serial PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  university text NOT NULL DEFAULT '',
  year varchar(80) NOT NULL DEFAULT '',
  phone varchar(60) NOT NULL DEFAULT '',
  email varchar(180) NOT NULL DEFAULT '',
  linkedin text NOT NULL DEFAULT '',
  experiences jsonb NOT NULL DEFAULT '[]',
  reason text NOT NULL DEFAULT '',
  status varchar(30) NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS messages (
  id serial PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  phone varchar(60) NOT NULL DEFAULT '',
  email varchar(180) NOT NULL DEFAULT '',
  type varchar(120) NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status varchar(30) NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
`;

const globalForBootstrap = globalThis as typeof globalThis & {
  __hlBootstrapPromise?: Promise<void>;
};

async function seedIfEmpty() {
  const contentRows = await db.select({ n: count() }).from(siteContent);
  if ((contentRows[0]?.n ?? 0) === 0) {
    await db.insert(siteContent).values({ id: 1, data: DEFAULT_CONTENT });
  }

  const authRows = await db.select({ n: count() }).from(adminAuth);
  if ((authRows[0]?.n ?? 0) === 0) {
    await db.insert(adminAuth).values({ id: 1, passwordHash: "" });
  }

  const assistantRows = await db.select({ n: count() }).from(assistantSettings);
  if ((assistantRows[0]?.n ?? 0) === 0) {
    await db.insert(assistantSettings).values({ id: 1 });
  }

  const articleRows = await db.select({ n: count() }).from(articles);
  if ((articleRows[0]?.n ?? 0) === 0) {
    await db.insert(articles).values(SEED_ARTICLES);
  }

  const mediaRows = await db.select({ n: count() }).from(mediaItems);
  if ((mediaRows[0]?.n ?? 0) === 0) {
    await db.insert(mediaItems).values(SEED_MEDIA);
  }

  const bookRows = await db.select({ n: count() }).from(books);
  if ((bookRows[0]?.n ?? 0) === 0) {
    await db.insert(books).values(SEED_BOOKS);
  }

  const serviceRows = await db.select({ n: count() }).from(services);
  if ((serviceRows[0]?.n ?? 0) === 0) {
    await db.insert(services).values(SEED_SERVICES);
  }

  const faqRows = await db.select({ n: count() }).from(faqs);
  if ((faqRows[0]?.n ?? 0) === 0) {
    await db.insert(faqs).values(SEED_FAQS);
  }

  const timelineRows = await db.select({ n: count() }).from(timelineItems);
  if ((timelineRows[0]?.n ?? 0) === 0) {
    await db.insert(timelineItems).values(SEED_TIMELINE);
  }

  const awardRows = await db.select({ n: count() }).from(awards);
  if ((awardRows[0]?.n ?? 0) === 0) {
    await db.insert(awards).values(SEED_AWARDS);
  }
}

async function run() {
  await pool.query(DDL);
  await seedIfEmpty();
}

export function ensureDb(): Promise<void> {
  if (!globalForBootstrap.__hlBootstrapPromise) {
    globalForBootstrap.__hlBootstrapPromise = run().catch((err) => {
      globalForBootstrap.__hlBootstrapPromise = undefined;
      throw err;
    });
  }
  return globalForBootstrap.__hlBootstrapPromise;
}
