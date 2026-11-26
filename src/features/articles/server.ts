import type { FeatureServer } from "@/features/server";

export const articlesServer: FeatureServer = {
  name: "articles-tags",
  ddl: `ALTER TABLE articles ADD COLUMN IF NOT EXISTS tags text NOT NULL DEFAULT '';`,
};
