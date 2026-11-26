import { pgTable, serial, text, varchar, boolean } from "drizzle-orm/pg-core";

export const pressReleases = pgTable("press_releases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  date: varchar("date", { length: 20 }).notNull().default(""),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  pdfLink: text("pdf_link").notNull().default(""),
  published: boolean("published").notNull().default(true),
});
