import { isAdminRequest, hasPassword } from "@/lib/auth";
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
  ]);
  return Response.json({
    ok: true,
    content,
    entities: { articles, media, books, services, faqs, timeline, awards },
    applications,
    messages,
    hasPassword: passwordSet,
  });
}
