import crypto from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { adminAuth } from "@/db/schema";
import { ensureDb } from "@/db/bootstrap";

const COOKIE = "hl_admin";
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sha256(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

async function storedHash(): Promise<string> {
  await ensureDb();
  const rows = await db.select().from(adminAuth);
  return rows[0]?.passwordHash ?? "";
}

function secret(hash: string) {
  return `hl-lawfirm|${process.env.ADMIN_SECRET ?? "arena-secret"}|${hash}`;
}

function sign(data: string, hash: string) {
  return crypto
    .createHmac("sha256", secret(hash))
    .update(data)
    .digest("base64url");
}

function makeToken(hash: string): string {
  const exp = Date.now() + TTL_MS;
  const data = String(exp);
  return `${data}.${sign(data, hash)}`;
}

function verifyTokenValue(token: string | undefined | null, hash: string): boolean {
  if (!token) return false;
  const [data, sig] = token.split(".");
  const exp = Number(data);
  if (!data || !sig || !Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = sign(data, hash);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Attempts login. When no password is configured yet, any (even empty) password is accepted.
 *  Returns the session token so the client can persist it (works even if cookies are blocked). */
export async function login(password: string): Promise<string | null> {
  const hash = await storedHash();
  if (hash && sha256(password) !== hash) return null;
  const token = makeToken(hash);
  try {
    const store = await cookies();
    store.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: TTL_MS / 1000,
    });
  } catch {
    // Cookie may be rejectable in some contexts — token fallback still works
  }
  return token;
}

export async function logout() {
  try {
    const store = await cookies();
    store.delete(COOKIE);
  } catch {
    /* noop */
  }
}

/** Cookie-based check (same-origin contexts). */
export async function isAdmin(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE)?.value;
    if (!token) return false;
    const hash = await storedHash();
    return verifyTokenValue(token, hash);
  } catch {
    return false;
  }
}

/** Request-based check for API routes: Authorization Bearer first, cookie fallback. */
export async function isAdminRequest(req: Request): Promise<boolean> {
  try {
    const auth = req.headers.get("authorization");
    let token: string | undefined;
    if (auth?.startsWith("Bearer ")) token = auth.slice(7).trim();
    if (!token) {
      const store = await cookies();
      token = store.get(COOKIE)?.value;
    }
    if (!token) return false;
    const hash = await storedHash();
    return verifyTokenValue(token, hash);
  } catch {
    return false;
  }
}

export async function changePassword(newPassword: string) {
  await ensureDb();
  const hash = newPassword ? sha256(newPassword) : "";
  await db
    .insert(adminAuth)
    .values({ id: 1, passwordHash: hash })
    .onConflictDoUpdate({ target: adminAuth.id, set: { passwordHash: hash } });
}

export async function hasPassword(): Promise<boolean> {
  return (await storedHash()).length > 0;
}
