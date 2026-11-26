import type { FeatureServer } from "@/features/server";
import { guides, glossary } from "./schema";

/** Tables start empty on purpose: the legal content is written and approved by the office. */
export const guidesServer: FeatureServer = {
  name: "guides",
  ddl: `
CREATE TABLE IF NOT EXISTS guides (
  id serial PRIMARY KEY, title text NOT NULL DEFAULT '', category varchar(80) NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '', body text NOT NULL DEFAULT '', published boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS glossary (id serial PRIMARY KEY, term text NOT NULL DEFAULT '', definition text NOT NULL DEFAULT '');`,
  entities: {
    guides: { table: guides, idColumn: guides.id, fields: { title: "text", category: "text", summary: "text", body: "text", published: "boolean" } },
    glossary: { table: glossary, idColumn: glossary.id, fields: { term: "text", definition: "text" } },
  },
};
