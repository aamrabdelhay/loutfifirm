import type { FeatureServer } from "@/features/server";

export const awardsServer: FeatureServer = {
  name: "awards-kinds",
  ddl: `ALTER TABLE awards ADD COLUMN IF NOT EXISTS kind varchar(20) NOT NULL DEFAULT 'award';`,
};
