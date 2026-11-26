import { pgTable, serial, text, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const trainingGroups = pgTable("training_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  accessCode: text("access_code").notNull().default(""),
  notes: text("notes").notNull().default(""),
  active: boolean("active").notNull().default(true),
});
export const trainingSessions = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().default(0),
  title: text("title").notNull().default(""),
  date: varchar("date", { length: 20 }).notNull().default(""),
  time: varchar("time", { length: 20 }).notNull().default(""),
  place: text("place").notNull().default(""),
  notes: text("notes").notNull().default(""),
});
export const trainingAssignments = pgTable("training_assignments", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().default(0),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  dueDate: varchar("due_date", { length: 20 }).notNull().default(""),
});
export const trainingAttendance = pgTable("training_attendance", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().default(0),
  traineeName: text("trainee_name").notNull().default(""),
  present: boolean("present").notNull().default(true),
});
