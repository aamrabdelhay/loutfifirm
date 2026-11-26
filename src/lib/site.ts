/** Canonical public origin. Set SITE_URL in Vercel to override. */
export const SITE_URL = (process.env.SITE_URL?.trim() || "https://loutfifirm.vercel.app").replace(/\/$/, "");
