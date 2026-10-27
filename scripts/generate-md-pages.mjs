/**
 * AEO Boilerplate — scripts/generate-md-pages.mjs  (Oct 2026 edition)
 *
 * Writes a clean .md version of every product (public/<category>/<product>.md):
 * answer first, facts in a table, an updated-on date. This extractable content,
 * not llms.txt, is what AI engines actually consume. Link the .md files from
 * llms.txt (generate-llms-txt.mjs).
 *
 * Chain it in package.json:
 *   "build": "node scripts/generate-llms-txt.mjs && node scripts/generate-md-pages.mjs && next build"
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { categories, SITE } from "../src/data/categories.mjs";

const today = new Date().toISOString().slice(0, 10);

for (const cat of categories) {
  mkdirSync(`public/${cat.slug}`, { recursive: true });
  for (const p of cat.products) {
    const lines = [
      `# ${p.name}`,
      "",
      // Answer first: 2 to 4 factual sentences, no superlatives.
      `> ${p.description ?? `${p.name}: ${cat.name}.`}`,
      "",
      "## Specifications",
      "",
      "| Item | Value |",
      "|---|---|",
      ...Object.entries(p.specs ?? {}).map(([k, v]) => `| ${k} | ${v} |`),
      "",
      `Category: ${cat.name}. Page: ${SITE}/${cat.slug}/${p.slug}`,
      "",
      `Updated on: ${today}`,
      "",
    ];
    writeFileSync(`public/${cat.slug}/${p.slug}.md`, lines.join("\n"));
  }
}
console.log("md pages written");
