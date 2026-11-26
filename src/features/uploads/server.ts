import type { FeatureServer } from "@/features/server";

/**
 * Private file storage inside the site's own Postgres (no external provider, no public URLs).
 * Files can only be read back by a strict admin session. Off unless UPLOADS_ENABLED=1.
 */
export const uploadsServer: FeatureServer = {
  name: "uploads",
  ddl: `
CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY, kind varchar(20) NOT NULL, filename text NOT NULL, mime varchar(100) NOT NULL,
  size integer NOT NULL, data bytea NOT NULL, claimed boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS uploads_unclaimed_idx ON uploads (created_at) WHERE claimed = false;
ALTER TABLE intake_requests ADD COLUMN IF NOT EXISTS attachment_ids jsonb NOT NULL DEFAULT '[]';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS cv_upload_id text NOT NULL DEFAULT '';`,
};
