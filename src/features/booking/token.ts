import crypto from "node:crypto";
import { SITE_URL } from "@/lib/site";
import { officeSecret } from "./upstream";

const TTL_MS = 90 * 24 * 3600 * 1000;

/**
 * The id the office system stores is derived on the server from the visitor's request id and a secret, so a visitor
 * cannot choose or guess another person's appointment id (they cannot mint a manage link for it). Retrying the same
 * request id gives the same id, so the office system's own idempotency still protects against double submits.
 */
export function deriveSubmissionId(clientRequestId: string): string | null {
  const secret = officeSecret();
  if (!secret) return null;
  const h = crypto.createHmac("sha256", `submission|${secret}`).update(clientRequestId).digest();
  h[6] = (h[6] & 0x0f) | 0x40;
  h[8] = (h[8] & 0x3f) | 0x80;
  const x = h.subarray(0, 16).toString("hex");
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20, 32)}`;
}

function sign(submissionId: string, exp: number): string | null {
  const secret = officeSecret();
  if (!secret) return null;
  return crypto.createHmac("sha256", `manage|${secret}`).update(`${submissionId}.${exp}`).digest("base64url").slice(0, 32);
}

/** Expiring token that lets a visitor manage only their own request. Format: <expiryMs>.<signature>. */
export function manageToken(submissionId: string, now = Date.now()): string | null {
  const exp = now + TTL_MS;
  const sig = sign(submissionId, exp);
  return sig ? `${exp}.${sig}` : null;
}

export function verifyManageToken(submissionId: string, token: string, now = Date.now()): boolean {
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!sig || !Number.isFinite(exp) || exp < now) return false;
  const expected = sign(submissionId, exp);
  if (!expected || sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function manageUrl(submissionId: string): string | null {
  const t = manageToken(submissionId);
  return t ? `${SITE_URL}/appointment?id=${encodeURIComponent(submissionId)}&t=${encodeURIComponent(t)}` : null;
}
