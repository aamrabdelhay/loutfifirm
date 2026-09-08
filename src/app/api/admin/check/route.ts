import { isAdminRequest, hasPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  return Response.json({ ok: true, hasPassword: await hasPassword() });
}
