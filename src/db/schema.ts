import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

/** Single JSON document holding every editable text/section of the site */
export const siteContent = pgTable("site_content", {
  id: integer("id").primaryKey(),
  data: jsonb("data").notNull(),
});

export const adminAuth = pgTable("admin_auth", {
  id: integer("id").primaryKey(),
  passwordHash: text("password_hash").notNull().default(""),
});

export const assistantSettings = pgTable("assistant_settings", {
  id: integer("id").primaryKey(),
  apiKey: text("api_key").notNull().default(""),
  model: varchar("model", { length: 180 }).notNull().default("gpt-4o-mini"),
  endpoint: text("endpoint").notNull().default("https://api.openai.com/v1/chat/completions"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  category: varchar("category", { length: 180 }).notNull().default(""),
  image: text("image").notNull().default(""),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  source: varchar("source", { length: 180 }).notNull().default(""),
  dateLabel: varchar("date_label", { length: 60 }).notNull().default(""),
  type: varchar("type", { length: 20 }).notNull().default("youtube"),
  url: text("url").notNull().default(""),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  category: varchar("category", { length: 40 }).notNull().default("civil"),
  year: varchar("year", { length: 60 }).notNull().default(""),
  note: text("note").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  sort: integer("sort").notNull().default(0),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  summary: text("summary").notNull().default(""),
  paragraph: text("paragraph").notNull().default(""),
  icon: varchar("icon", { length: 60 }).notNull().default("Scale"),
  audience: jsonb("audience").notNull().default([]),
  items: jsonb("items").notNull().default([]),
  note: text("note").notNull().default(""),
  published: boolean("published").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull().default(""),
  answer: text("answer").notNull().default(""),
  published: boolean("published").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export const timelineItems = pgTable("timeline_items", {
  id: serial("id").primaryKey(),
  yearLabel: varchar("year_label", { length: 80 }).notNull().default(""),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const awards = pgTable("awards", {
  id: serial("id").primaryKey(),
  year: varchar("year", { length: 60 }).notNull().default(""),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  icon: varchar("icon", { length: 60 }).notNull().default("Trophy"),
  sort: integer("sort").notNull().default(0),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  university: text("university").notNull().default(""),
  year: varchar("year", { length: 80 }).notNull().default(""),
  phone: varchar("phone", { length: 60 }).notNull().default(""),
  email: varchar("email", { length: 180 }).notNull().default(""),
  linkedin: text("linkedin").notNull().default(""),
  experiences: jsonb("experiences").notNull().default([]),
  reason: text("reason").notNull().default(""),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  phone: varchar("phone", { length: 60 }).notNull().default(""),
  email: varchar("email", { length: 180 }).notNull().default(""),
  type: varchar("type", { length: 120 }).notNull().default(""),
  message: text("message").notNull().default(""),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
