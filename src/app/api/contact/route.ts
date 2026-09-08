import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { messages } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await ensureDb();
    const body = (await req.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    if (!name || !phone || !message) {
      return Response.json(
        { ok: false, error: "برجاء استكمال الاسم ورقم الهاتف ونص الاستفسار" },
        { status: 400 }
      );
    }
    await db.insert(messages).values({
      name,
      phone,
      email,
      type: String(body.type ?? "").trim(),
      message,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "حدث خطأ أثناء الإرسال" }, { status: 500 });
  }
}
