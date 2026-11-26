"use client";

/**
 * First-touch lead source: utm_* parameters and the external referrer host, kept in sessionStorage
 * (cleared when the tab closes, never sent anywhere until a form is submitted).
 * Set TRACKING_REQUIRES_CONSENT=false only if the office's lawyer confirms consent is not needed.
 */
const KEY = "lead_source_v1";
export const TRACKING_REQUIRES_CONSENT = true;

export function hasAnalyticsConsent(): boolean {
  try { return localStorage.getItem("cookie_consent_v1") === "all"; } catch { return false; }
}

export function captureLeadSource(): void {
  try {
    if (TRACKING_REQUIRES_CONSENT && !hasAnalyticsConsent()) return;
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(location.search);
    const parts: string[] = [];
    for (const k of ["utm_source", "utm_medium", "utm_campaign"]) {
      const v = q.get(k)?.slice(0, 60);
      if (v) parts.push(`${k.slice(4)}=${v}`);
    }
    if (document.referrer) {
      try {
        const h = new URL(document.referrer).hostname;
        if (h && h !== location.hostname) parts.push(`ref=${h}`);
      } catch { /* ignore bad referrer */ }
    }
    sessionStorage.setItem(KEY, parts.join("&") || "direct");
  } catch { /* storage blocked */ }
}

/** Value to attach to a form submission; empty when nothing was captured or consent is missing. */
export function getLeadSource(): string {
  try {
    if (TRACKING_REQUIRES_CONSENT && !hasAnalyticsConsent()) return "";
    return (sessionStorage.getItem(KEY) ?? "").slice(0, 200);
  } catch { return ""; }
}
