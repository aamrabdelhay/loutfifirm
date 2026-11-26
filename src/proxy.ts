import { NextResponse, type NextRequest } from "next/server";

/**
 * Locale URLs: /en/... and /fr/... serve the same pages as the Arabic default and switch the site language.
 * The page text is still translated in the browser by Google Translate (the site has no per-language content),
 * so these URLs are noindex unless INDEX_LOCALES=1 is set (see layout metadata).
 */
export function proxy(req: NextRequest) {
  const m = req.nextUrl.pathname.match(/^\/(en|fr)(\/.*)?$/);
  if (!m) return NextResponse.next();
  const locale = m[1];
  const rest = m[2] || "/";
  const url = req.nextUrl.clone();
  url.pathname = rest;
  const headers = new Headers(req.headers);
  headers.set("x-site-locale", locale);
  headers.set("x-site-path", rest);
  const res = NextResponse.rewrite(url, { request: { headers } });
  res.cookies.set("googtrans", `/ar/${locale}`, { path: "/", maxAge: 31536000, sameSite: "lax" });
  res.cookies.set("loutfi-site-language", locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
  return res;
}

export const config = { matcher: ["/(en|fr)", "/(en|fr)/:path*"] };
