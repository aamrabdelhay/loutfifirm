import { pgTable, serial, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const studies = pgTable("studies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  kind: varchar("kind", { length: 20 }).notNull().default("study"),
  summary: text("summary").notNull().default(""),
  content: text("content").notNull().default(""),
  year: varchar("year", { length: 20 }).notNull().default(""),
  fileUrl: text("file_url").notNull().default(""),
  published: boolean("published").notNull().default(false),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const STUDY_KINDS: Record<string, string> = { study: "دراسة قانونية", research: "بحث", analysis: "تحليل قانوني", case: "دراسة حالة" };
