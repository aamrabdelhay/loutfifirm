"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement?: new (config: Record<string, unknown>, element: string) => unknown } };
  }
}

const COOKIE = "loutfi-site-language";
const GT_COOKIE = "googtrans";

function language() {
  const value = document.cookie.match(new RegExp("(?:^|; )" + COOKIE + "=([^;]*)"))?.[1];
  return value === "en" || value === "fr" ? value : "ar";
}

function protect() {
  document.querySelectorAll<HTMLElement>(
    "[data-notranslate], .notranslate, [translate=\"no\"]"
  ).forEach((el) => {
    el.classList.add("notranslate");
    el.setAttribute("translate", "no");
  });
}

function hideUi() {
  document.querySelectorAll<HTMLElement>(
    ".goog-te-banner-frame,.goog-te-balloon-frame,.goog-tooltip,.goog-te-spinner-pos"
  ).forEach((el) => { el.style.display = "none"; });
  document.body.style.top = "0";
}

function apply(lang: "en" | "fr") {
  const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
  if (!select) return false;
  if (select.value !== lang) {
    select.value = lang;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }
  return true;
}

export function GoogleTranslateBridge() {
  useEffect(() => {
    const lang = language();
    protect();
    hideUi();
    if (lang === "ar") return;

    document.cookie = GT_COOKIE + "=/ar/" + lang + "; Path=/; Max-Age=31536000; SameSite=Lax";

    let tries = 0;
    let timer: number | undefined;
    let stopped = false;

    const finish = () => {
      if (stopped) return;
      protect();
      hideUi();
      if (apply(lang)) {
        window.setTimeout(() => { protect(); hideUi(); }, 250);
        window.setTimeout(() => { protect(); hideUi(); }, 1000);
        window.setTimeout(() => { protect(); hideUi(); }, 2500);
        if (timer) window.clearInterval(timer);
      } else if (++tries > 100 && timer) {
        window.clearInterval(timer);
      }
    };

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "ar", includedLanguages: "en,fr", autoDisplay: false, multilanguagePage: true },
          "google_translate_element"
        );
      }
      finish();
    };

    const existing = document.getElementById("google-translate-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }

    const observer = new MutationObserver(() => { protect(); hideUi(); });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    timer = window.setInterval(finish, 200);
    finish();

    return () => {
      stopped = true;
      if (timer) window.clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  return <div id="google_translate_element" className="pointer-events-none fixed -left-[10000px] top-0 z-[-1] h-1 w-1 overflow-hidden opacity-0" aria-hidden="true" />;
}
