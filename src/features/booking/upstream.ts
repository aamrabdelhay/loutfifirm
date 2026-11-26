const DEFAULT_ADMIN_URL = "https://dr-hossam-lotfy-hw88.vercel.app/api/public/appointments";

/** Base URL of the office system, derived from the existing appointment endpoint setting. */
export function officeBase(): string {
  const url = (process.env.APPOINTMENTS_API_URL?.trim() || DEFAULT_ADMIN_URL).replace(/\/$/, "");
  return url.replace(/\/api\/public\/appointments$/, "");
}

export function officeSecret(): string | null {
  return process.env.APPOINTMENTS_API_SECRET?.trim() || null;
}

export async function officeFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const secret = officeSecret();
  if (!secret) throw new Error("APPOINTMENTS_API_SECRET is not configured");
  return fetch(`${officeBase()}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-Appointment-Secret": secret, ...(init.headers ?? {}) },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}
