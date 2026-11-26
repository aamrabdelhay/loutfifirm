import { pgTable, serial, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const intakeRequests = pgTable("intake_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  phone: varchar("phone", { length: 60 }).notNull().default(""),
  email: varchar("email", { length: 180 }).notNull().default(""),
  contactMethod: varchar("contact_method", { length: 20 }).notNull().default("phone"),
  caseType: varchar("case_type", { length: 60 }).notNull().default(""),
  urgency: varchar("urgency", { length: 20 }).notNull().default("normal"),
  deadlineDate: varchar("deadline_date", { length: 20 }).notNull().default(""),
  summary: text("summary").notNull().default(""),
  source: varchar("source", { length: 200 }).notNull().default(""),
  attachmentIds: jsonb("attachment_ids").notNull().default([]),
  documents: jsonb("documents").notNull().default([]),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
