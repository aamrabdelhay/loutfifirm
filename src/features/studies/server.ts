import type { FeatureServer } from "@/features/server";
import { studies } from "./schema";

export const studiesServer: FeatureServer = {
  name: "studies",
  ddl: `
CREATE TABLE IF NOT EXISTS studies (
  id serial PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  kind varchar(20) NOT NULL DEFAULT 'study',
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  year varchar(20) NOT NULL DEFAULT '',
  file_url text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);`,
  entities: {
    studies: {
      table: studies,
      idColumn: studies.id,
      orderBySort: true,
      fields: { title: "text", kind: "text", summary: "text", content: "text", year: "text", fileUrl: "text", published: "boolean", sort: "number" },
    },
  },
};
