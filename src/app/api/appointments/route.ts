import { z } from 'zod';
import { BRANCH_IDS, MODES, MODE_LABELS } from '@/features/booking/config';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { deriveSubmissionId, manageUrl } from '@/features/booking/token';
import { sendMail } from '@/features/booking/mail';

const DEFAULT_ADMIN_URL = 'https://dr-hossam-lotfy-hw88.vercel.app/api/public/appointments';

const schema = z.object({
  submissionId: z.string().uuid(),
  name: z.string().trim().min(2).max(300),
  phone: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(200).optional().or(z.literal('')),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal('')),
  type: z.string().trim().min(1).max(200),
  notes: z.string().trim().max(3500).optional(),
  branchId: z.enum(BRANCH_IDS).optional(),
  branchLabel: z.string().trim().max(120).optional(),
  mode: z.enum(MODES).optional(),
  source: z.string().max(200).optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`appt:${clientKey(req)}`, 6, 10 * 60_000)) {
    return Response.json({ ok: false, error: 'محاولات كثيرة، حاول لاحقًا' }, { status: 429 });
  }
  try {
    const adminUrl = (process.env.APPOINTMENTS_API_URL?.trim() || DEFAULT_ADMIN_URL).replace(/\/$/, '');
    const secret = process.env.APPOINTMENTS_API_SECRET?.trim();
    if (!secret) {
      console.error('APPOINTMENTS_API_SECRET is not configured');
      return Response.json({ ok: false, error: 'خدمة الحجز غير متاحة حاليًا' }, { status: 503 });
    }
    const body = schema.parse(await req.json());
    // The office system stores branch/method in notes until its own columns exist,
    // so nothing the visitor chose is lost by an older office deployment.
    const meta = [
      body.branchLabel ? `الفرع: ${body.branchLabel}` : '',
      body.source ? `المصدر: ${body.source}` : '',
      body.mode ? `طريقة المقابلة: ${MODE_LABELS[body.mode].ar}` : '',
    ].filter(Boolean).join(' | ');
    const submissionId = deriveSubmissionId(body.submissionId);
    if (!submissionId) return Response.json({ ok: false, error: 'خدمة الحجز غير متاحة حاليًا' }, { status: 503 });
    const payload = { ...body, submissionId, notes: [meta ? `[${meta}]` : '', body.notes ?? ''].filter(Boolean).join('\n') };
    const response = await fetch(adminUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Appointment-Secret': secret },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      console.error('Appointment handoff failed:', { status: response.status, data });
      return Response.json({ ok: false, error: data.error || 'تعذر تأكيد الموعد حاليًا' }, { status: response.status >= 500 ? 502 : response.status });
    }
    const link = manageUrl(submissionId);
    let emailed = false;
    if (body.email && link) {
      const when = body.date && body.time ? `الموعد المطلوب: ${body.date} ${body.time}\n` : '';
      emailed = await sendMail(
        body.email,
        'تم استلام طلب الموعد - مكتب أ.د/ حسام لطفي',
        `مرحبًا ${body.name}،\n\nاستلمنا طلب الموعد الخاص بك. هذا الطلب لا يُعد تأكيدًا نهائيًا حتى يؤكده المكتب.\n${when}\nلعرض حالة الطلب أو طلب التعديل أو الإلغاء:\n${link}\n\nمكتب أ.د/ حسام لطفي للمحاماة والاستشارات القانونية`
      );
    }
    return Response.json({ ok: true, manageUrl: link, emailed });
  } catch (error) {
    console.error('Appointment submission failed:', error);
    return Response.json({ ok: false, error: 'حدث خطأ أثناء حجز الموعد' }, { status: 400 });
  }
}
