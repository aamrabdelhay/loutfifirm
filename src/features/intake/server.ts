import type { FeatureServer } from "@/features/server";
import { intakeRequests } from "./schema";

export const intakeServer: FeatureServer = {
  name: "intake",
  ddl: `
CREATE TABLE IF NOT EXISTS intake_requests (
  id serial PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  phone varchar(60) NOT NULL DEFAULT '',
  email varchar(180) NOT NULL DEFAULT '',
  contact_method varchar(20) NOT NULL DEFAULT 'phone',
  case_type varchar(60) NOT NULL DEFAULT '',
  urgency varchar(20) NOT NULL DEFAULT 'normal',
  deadline_date varchar(20) NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  documents jsonb NOT NULL DEFAULT '[]',
  status varchar(30) NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);`,
  entities: {
    intake: {
      table: intakeRequests,
      idColumn: intakeRequests.id,
      fields: { status: "text" },
    },
  },
};
