import type { FeatureServer } from "@/features/server";

export const libraryServer: FeatureServer = {
  name: "library-books",
  ddl: `
ALTER TABLE books ADD COLUMN IF NOT EXISTS author text NOT NULL DEFAULT '';
ALTER TABLE books ADD COLUMN IF NOT EXISTS publisher text NOT NULL DEFAULT '';
ALTER TABLE books ADD COLUMN IF NOT EXISTS isbn varchar(40) NOT NULL DEFAULT '';
ALTER TABLE books ADD COLUMN IF NOT EXISTS link text NOT NULL DEFAULT '';`,
};
