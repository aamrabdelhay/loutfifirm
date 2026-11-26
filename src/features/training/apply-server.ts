import type { FeatureServer } from "@/features/server";

export const applyServer: FeatureServer = {
  name: "training-apply",
  ddl: `ALTER TABLE applications ADD COLUMN IF NOT EXISTS cv_link text NOT NULL DEFAULT '';`,
};
