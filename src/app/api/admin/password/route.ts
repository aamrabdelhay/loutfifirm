import { isAdminRequest, changePassword, hasPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  if (!(await isAdminRequest(req))) {
    return Response.json({ ok: false }, { status: 401 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { password?: string };
    await changePassword((body.password ?? "").trim());
    return Response.json({ ok: true, hasPassword: await hasPassword() });
  } catch {
    return Response.json({ ok: false, error: "تعذر حفظ كلمة المرور" }, { status: 500 });
  }
}
