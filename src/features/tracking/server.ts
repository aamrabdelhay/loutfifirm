import type { FeatureServer } from "@/features/server";

export const trackingServer: FeatureServer = {
  name: "tracking",
  ddl: `
ALTER TABLE messages ADD COLUMN IF NOT EXISTS source varchar(200) NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS source varchar(200) NOT NULL DEFAULT '';
ALTER TABLE intake_requests ADD COLUMN IF NOT EXISTS source varchar(200) NOT NULL DEFAULT '';`,
};
