import { pgTable, serial, text, varchar, boolean } from "drizzle-orm/pg-core";

export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  category: varchar("category", { length: 80 }).notNull().default(""),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  published: boolean("published").notNull().default(true),
});
export const glossary = pgTable("glossary", {
  id: serial("id").primaryKey(),
  term: text("term").notNull().default(""),
  definition: text("definition").notNull().default(""),
});
