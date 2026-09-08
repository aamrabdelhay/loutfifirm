import { login, hasPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { password?: string };
    const token = await login(body.password ?? "");
    if (!token) {
      return Response.json(
        { ok: false, error: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }
    return Response.json({ ok: true, token, hasPassword: await hasPassword() });
  } catch {
    return Response.json({ ok: false, error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
