import type { EntityDef } from "@/lib/server-entities";
import { intakeServer } from "./intake/server";
import { libraryServer } from "./library/server";
import { studiesServer } from "./studies/server";
import { mediaServer } from "./media/server";
import { awardsServer } from "./awards/server";
import { applyServer } from "./training/apply-server";
import { trainingServer } from "./training/server";
import { eventsServer } from "./events/server";
import { guidesServer } from "./guides/server";
import { pressServer } from "./press/server";
import { trackingServer } from "./tracking/server";
import { uploadsServer } from "./uploads/server";
import { articlesServer } from "./articles/server";

/**
 * Server-side registry for optional feature modules.
 * Each feature contributes idempotent DDL (CREATE TABLE IF NOT EXISTS /
 * ALTER TABLE ... ADD COLUMN IF NOT EXISTS) and admin-editable entities.
 * Features are appended below by their own patch files.
 */
export type FeatureServer = {
  name: string;
  ddl?: string;
  entities?: Record<string, EntityDef>;
};

export const FEATURE_SERVERS: FeatureServer[] = [
  intakeServer,
  articlesServer,
  libraryServer,
  studiesServer,
  mediaServer,
  awardsServer,
  applyServer,
  trainingServer,
  eventsServer,
  guidesServer,
  pressServer,
  trackingServer,
  uploadsServer,
  // FEATURE-REGISTRY:SERVER (do not remove this marker)
];

export const FEATURE_DDL = (): string =>
  FEATURE_SERVERS.map((f) => f.ddl ?? "").filter(Boolean).join("\n");

/** Entities holding personal data or secrets: readable and writable only by a strict admin session. */
export const PII_ENTITIES = new Set(["intake", "event_registrations", "training_attendance", "training_groups"]);

export const FEATURE_ENTITIES = (): Record<string, EntityDef> =>
  Object.assign({}, ...FEATURE_SERVERS.map((f) => f.entities ?? {}));
