import type { FeatureServer } from "@/features/server";
import { events, eventRegistrations } from "./schema";

export const eventsServer: FeatureServer = {
  name: "events",
  ddl: `
CREATE TABLE IF NOT EXISTS events (
  id serial PRIMARY KEY, title text NOT NULL DEFAULT '', kind varchar(20) NOT NULL DEFAULT 'event',
  date varchar(20) NOT NULL DEFAULT '', time varchar(20) NOT NULL DEFAULT '', place text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', capacity integer NOT NULL DEFAULT 0, published boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS event_registrations (
  id serial PRIMARY KEY, event_id integer NOT NULL DEFAULT 0, name text NOT NULL DEFAULT '', email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS event_reg_unique ON event_registrations (event_id, lower(email));`,
  entities: {
    events: { table: events, idColumn: events.id, fields: { title: "text", kind: "text", date: "text", time: "text", place: "text", link: "text", description: "text", capacity: "number", published: "boolean" } },
    event_registrations: { table: eventRegistrations, idColumn: eventRegistrations.id, fields: { eventId: "number", name: "text", email: "text", phone: "text" } },
  },
};
