import { isAdminRequest, isStrictAdminRequest, hasPassword } from "@/lib/auth";
import { PII_ENTITIES } from "@/features/server";
import {
  getContent,
  listArticles,
  listMedia,
  listBooks,
  listServices,
  listFaqs,
  listTimeline,
  listAwards,
  listApplications,
  listMessages,
} from "@/lib/content";
import { listFeatureEntities } from "@/features/list";

export const dynamic = "force-dynamic";

/** Everything the admin dashboard needs in a single request */
export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const [
    content,
    articles,
    media,
    books,
    services,
    faqs,
    timeline,
    awards,
    applications,
    messages,
    passwordSet,
    featureEntities,
  ] = await Promise.all([
    getContent(),
    listArticles(false),
    listMedia(false),
    listBooks(),
    listServices(false),
    listFaqs(false),
    listTimeline(),
    listAwards(),
    listApplications(),
    listMessages(),
    hasPassword(),
    listFeatureEntities(),
  ]);
  const strict = await isStrictAdminRequest(req);
  const safeFeatureEntities = Object.fromEntries(
    Object.entries(featureEntities).map(([k, rows]) => [k, PII_ENTITIES.has(k) && !strict ? [] : rows])
  );
  return Response.json({
    ok: true,
    piiLocked: !strict,
    content,
    entities: { articles, media, books, services, faqs, timeline, awards, ...safeFeatureEntities },
    applications,
    messages,
    hasPassword: passwordSet,
  });
}
