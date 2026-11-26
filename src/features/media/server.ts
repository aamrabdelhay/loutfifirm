import type { FeatureServer } from "@/features/server";

export const mediaServer: FeatureServer = {
  name: "media-archive",
  ddl: `
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS kind varchar(20) NOT NULL DEFAULT 'interview';
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS event text NOT NULL DEFAULT '';
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '';
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS transcript text NOT NULL DEFAULT '';`,
};
