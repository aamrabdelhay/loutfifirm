"use client";

import { useEffect } from "react";
import { captureLeadSource } from "./source";

export function LeadSourceCapture() {
  useEffect(() => {
    captureLeadSource();
    const on = () => captureLeadSource();
    window.addEventListener("cookie-consent-changed", on);
    return () => window.removeEventListener("cookie-consent-changed", on);
  }, []);
  return null;
}
