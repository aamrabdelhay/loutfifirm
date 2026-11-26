import { SITE_URL } from "@/lib/site";

/** Site-wide structured data. Only facts already published on the site: name, description, url. */
export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "LegalService", "@id": `${SITE_URL}/#office`, name: "مكتب أ.د/ حسام لطفي للمحاماة والاستشارات القانونية", url: SITE_URL, inLanguage: "ar", founder: { "@id": `${SITE_URL}/#person` } },
      { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "أ.د/ حسام لطفي", jobTitle: "أستاذ القانون المدني ومحامٍ بالنقض", url: `${SITE_URL}/about` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
