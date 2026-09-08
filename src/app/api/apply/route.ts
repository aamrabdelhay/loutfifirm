import { db } from "@/db";
import { ensureDb } from "@/db/bootstrap";
import { applications } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await ensureDb();
    const body = (await req.json()) as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const university = String(body.university ?? "").trim();
    const year = String(body.year ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const reason = String(body.reason ?? "").trim();
    if (!name || !university || !year || !phone || !email || !reason) {
      return Response.json(
        { ok: false, error: "برجاء استكمال جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }
    const experiences = Array.isArray(body.experiences)
      ? body.experiences.map((x) => String(x ?? "").trim()).filter(Boolean)
      : [];
    await db.insert(applications).values({
      name,
      university,
      year,
      phone,
      email,
      linkedin: String(body.linkedin ?? "").trim(),
      experiences,
      reason,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ ok: false, error: "حدث خطأ أثناء إرسال الطلب" }, { status: 500 });
  }
}
