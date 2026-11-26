import type { FeatureServer } from "@/features/server";
import { pressReleases } from "./schema";

export const pressServer: FeatureServer = {
  name: "press",
  ddl: `CREATE TABLE IF NOT EXISTS press_releases (
  id serial PRIMARY KEY, title text NOT NULL DEFAULT '', date varchar(20) NOT NULL DEFAULT '', summary text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '', pdf_link text NOT NULL DEFAULT '', published boolean NOT NULL DEFAULT true);`,
  entities: { press_releases: { table: pressReleases, idColumn: pressReleases.id, fields: { title: "text", date: "text", summary: "text", body: "text", pdfLink: "text", published: "boolean" } } },
};
