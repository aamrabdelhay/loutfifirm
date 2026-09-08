import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { getContent } from "@/lib/content";

/** Fetches shared content once and wraps pages with header + footer */
export async function SiteShell({ children }: { children: ReactNode }) {
  const content = await getContent();
  return (
    <>
      <SiteHeader
        siteName={content.general.siteName}
        siteNameEn={content.general.siteNameEn}
        tagline={content.general.tagline}
        headerCta={content.general.headerCta}
      />
      {children}
      <SiteFooter content={content} />
    </>
  );
}

export { getContent };
