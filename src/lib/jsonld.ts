// JSON-LD helpers that pass the Google Rich Results Test.
// Rules: Product needs offers|review|rating (use ItemList for price-less catalogs),
// Offer needs a numeric price, ItemList can't be empty, nested Org needs a logo,
// a consistent @id consolidates the entity in the Knowledge Graph.
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
const ORG_ID = `${SITE}/#organization`;

export const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Acme Audio",
  url: SITE,
  logo: `${SITE}/logo.png`,
  knowsAbout: [
    "70V line amplifiers",
    "Commercial sound systems",
    "Professional PA audio",
    "Audio matrices",
  ],
};

type Item = { name: string; slug: string };

export function catalogItemList(categorySlug: string, products: Item[]) {
  if (!products.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE}/${categorySlug}/${p.slug}`,
    })),
  };
}

export function faqPage(qa: { q: string; a: string }[]) {
  if (!qa.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
