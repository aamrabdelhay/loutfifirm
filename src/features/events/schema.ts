import { pgTable, serial, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  kind: varchar("kind", { length: 20 }).notNull().default("event"), // event | webinar
  date: varchar("date", { length: 20 }).notNull().default(""),
  time: varchar("time", { length: 20 }).notNull().default(""),
  place: text("place").notNull().default(""),
  link: text("link").notNull().default(""),
  description: text("description").notNull().default(""),
  capacity: integer("capacity").notNull().default(0), // 0 = unlimited
  published: boolean("published").notNull().default(true),
});
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().default(0),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
