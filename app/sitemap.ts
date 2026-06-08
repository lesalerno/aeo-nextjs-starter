import type { MetadataRoute } from "next";
import { categories } from "../src/data/categories.mjs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// URLs here must match the canonical exactly (no trailing slash) — see next.config.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = categories.flatMap((c: any) =>
    c.products.map((p: any) => ({
      url: `${SITE}/${c.slug}/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    ...productRoutes,
  ];
}
