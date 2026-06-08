// Generates /public/llms.txt and /public/llms-full.txt from your data, at build time.
// Wired via the "prebuild"/"predev" scripts in package.json so it never goes stale.
import { writeFileSync, mkdirSync } from "node:fs";
import { categories, COMPANY, SITE } from "../src/data/categories.mjs";

mkdirSync("public", { recursive: true });

const idx = [`# ${COMPANY.name}`, ""];
for (const line of COMPANY.summary) idx.push(`> ${line}`);
idx.push("", "## Product lines", "");
for (const cat of categories) {
  idx.push(`### ${cat.name}`);
  if (cat.description) idx.push(cat.description);
  for (const p of cat.products) {
    const specs = [p.power && `${p.power}W`, p.voltage, p.use].filter(Boolean).join(", ");
    idx.push(`- [${p.name}](${SITE}/${cat.slug}/${p.slug}): ${specs}.`);
  }
  idx.push("");
}
writeFileSync("public/llms.txt", idx.join("\n") + "\n");

const full = [`# ${COMPANY.name} — full corpus`, ""];
for (const line of COMPANY.summary) full.push(`> ${line}`);
full.push("");
for (const cat of categories) {
  full.push(`## ${cat.name}`, "");
  for (const p of cat.products) {
    full.push(`### ${p.name}`, `URL: ${SITE}/${cat.slug}/${p.slug}`);
    if (p.specs) for (const [k, v] of Object.entries(p.specs)) full.push(`- ${k}: ${v}`);
    full.push("");
  }
}
writeFileSync("public/llms-full.txt", full.join("\n") + "\n");

console.log(`[llms.txt] generated (${idx.length} index lines, ${full.length} corpus lines)`);
