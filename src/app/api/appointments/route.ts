import { z } from 'zod';

const DEFAULT_ADMIN_URL = 'https://dr-hossam-lotfy-hw88.vercel.app/api/public/appointments';

const schema = z.object({
  submissionId: z.string().uuid(),
  name: z.string().trim().min(2).max(300),
  phone: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(200).optional().or(z.literal('')),
  date: z.string().optional().or(z.literal('')),
  time: z.string().optional().or(z.literal('')),
  type: z.string().trim().min(1).max(200),
  notes: z.string().trim().max(4000).optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const adminUrl = (process.env.APPOINTMENTS_API_URL?.trim() || DEFAULT_ADMIN_URL).replace(/\/$/, '');
    const secret = process.env.APPOINTMENTS_API_SECRET?.trim();
    if (!secret) {
      console.error('APPOINTMENTS_API_SECRET is not configured');
      return Response.json({ ok: false, error: 'خدمة الحجز غير متاحة حاليًا' }, { status: 503 });
    }
    const body = schema.parse(await req.json());
    const response = await fetch(adminUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Appointment-Secret': secret },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      console.error('Appointment handoff failed:', { status: response.status, data });
      return Response.json({ ok: false, error: data.error || 'تعذر تأكيد الموعد حاليًا' }, { status: response.status >= 500 ? 502 : response.status });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Appointment submission failed:', error);
    return Response.json({ ok: false, error: 'حدث خطأ أثناء حجز الموعد' }, { status: 400 });
  }
}