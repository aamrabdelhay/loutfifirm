import {
  articles,
  mediaItems,
  books,
  services,
  faqs,
  timelineItems,
  awards,
  applications,
  messages,
} from "@/db/schema";

type ColType = "text" | "boolean" | "number" | "stringArray";

export type EntityDef = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idColumn: any;
  fields: Record<string, ColType>;
  orderBySort?: boolean;
};

export const SERVER_ENTITIES: Record<string, EntityDef> = {
  articles: {
    table: articles,
    idColumn: articles.id,
    fields: {
      title: "text",
      excerpt: "text",
      content: "text",
      category: "text",
      image: "text",
      published: "boolean",
    },
  },
  media: {
    table: mediaItems,
    idColumn: mediaItems.id,
    fields: {
      title: "text",
      description: "text",
      source: "text",
      dateLabel: "text",
      type: "text",
      url: "text",
      published: "boolean",
    },
  },
  books: {
    table: books,
    idColumn: books.id,
    fields: {
      title: "text",
      description: "text",
      category: "text",
      year: "text",
      note: "text",
      featured: "boolean",
      sort: "number",
    },
    orderBySort: true,
  },
  services: {
    table: services,
    idColumn: services.id,
    fields: {
      title: "text",
      summary: "text",
      paragraph: "text",
      icon: "text",
      audience: "stringArray",
      items: "stringArray",
      note: "text",
      published: "boolean",
      sort: "number",
    },
    orderBySort: true,
  },
  faqs: {
    table: faqs,
    idColumn: faqs.id,
    fields: { question: "text", answer: "text", published: "boolean", sort: "number" },
    orderBySort: true,
  },
  timeline: {
    table: timelineItems,
    idColumn: timelineItems.id,
    fields: { yearLabel: "text", title: "text", description: "text", sort: "number" },
    orderBySort: true,
  },
  awards: {
    table: awards,
    idColumn: awards.id,
    fields: { year: "text", title: "text", description: "text", icon: "text", sort: "number" },
    orderBySort: true,
  },
  applications: {
    table: applications,
    idColumn: applications.id,
    fields: { status: "text" },
  },
  messages: {
    table: messages,
    idColumn: messages.id,
    fields: { status: "text" },
  },
};

export function sanitize(
  def: EntityDef,
  body: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, type] of Object.entries(def.fields)) {
    const v = body[key];
    switch (type) {
      case "text":
        out[key] = typeof v === "string" ? v : v == null ? "" : String(v);
        break;
      case "boolean":
        out[key] = Boolean(v);
        break;
      case "number":
        out[key] = Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : 0;
        break;
      case "stringArray":
        out[key] = Array.isArray(v)
          ? v.map((x) => String(x ?? "")).filter((x) => x.trim() !== "")
          : [];
        break;
    }
  }
  return out;
}
