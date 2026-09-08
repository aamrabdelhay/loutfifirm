import { isAdminRequest } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const content = await getContent();
  return Response.json({ ok: true, content });
}

export async function PUT(req: Request) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  try {
    const body = await req.json();
    await saveContent(body?.content ?? body);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "تعذر حفظ المحتوى" }, { status: 500 });
  }
}
