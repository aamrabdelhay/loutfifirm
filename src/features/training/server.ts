import { EntityValidationError } from "@/lib/entity-error";
import type { FeatureServer } from "@/features/server";
import crypto from "node:crypto";
import { trainingGroups, trainingSessions, trainingAssignments, trainingAttendance } from "./schema";

export const hashAccessCode = (code: string) => crypto.createHash("sha256").update(`training-code|${code}`).digest("hex");
const isHash = (v: string) => /^[0-9a-f]{64}$/.test(v);

export const trainingServer: FeatureServer = {
  name: "training-groups",
  ddl: `
CREATE TABLE IF NOT EXISTS training_groups (
  id serial PRIMARY KEY, name text NOT NULL DEFAULT '', access_code text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '', active boolean NOT NULL DEFAULT true
);
ALTER TABLE training_groups ALTER COLUMN access_code TYPE text;
CREATE TABLE IF NOT EXISTS training_sessions (
  id serial PRIMARY KEY, group_id integer NOT NULL DEFAULT 0, title text NOT NULL DEFAULT '',
  date varchar(20) NOT NULL DEFAULT '', time varchar(20) NOT NULL DEFAULT '', place text NOT NULL DEFAULT '', notes text NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS training_assignments (
  id serial PRIMARY KEY, group_id integer NOT NULL DEFAULT 0, title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '', due_date varchar(20) NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS training_attendance (
  id serial PRIMARY KEY, session_id integer NOT NULL DEFAULT 0, trainee_name text NOT NULL DEFAULT '', present boolean NOT NULL DEFAULT true
);`,
  entities: {
    training_groups: { table: trainingGroups, idColumn: trainingGroups.id, fields: { name: "text", accessCode: "text", notes: "text", active: "boolean" },
      // The access code is stored hashed. A new code must be 16+ characters; an unchanged hash passes through.
      transform: (d) => {
        const code = String(d.accessCode ?? "").trim();
        if (isHash(code)) return d;
        if (code.length < 16) throw new EntityValidationError("access code must be at least 16 characters");
        return { ...d, accessCode: hashAccessCode(code) };
      },
    },
    training_sessions: { table: trainingSessions, idColumn: trainingSessions.id, fields: { groupId: "number", title: "text", date: "text", time: "text", place: "text", notes: "text" } },
    training_assignments: { table: trainingAssignments, idColumn: trainingAssignments.id, fields: { groupId: "number", title: "text", description: "text", dueDate: "text" } },
    training_attendance: { table: trainingAttendance, idColumn: trainingAttendance.id, fields: { sessionId: "number", traineeName: "text", present: "boolean" } },
  },
};
