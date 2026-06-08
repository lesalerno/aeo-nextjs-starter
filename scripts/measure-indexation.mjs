/**
 * AEO Boilerplate — scripts/measure-indexation.mjs
 * Measures REAL indexation via the Google Search Console URL Inspection API.
 *
 * Why: Google's sitemaps API LIES — the `indexed` field was deprecated and
 * always returns 0. The URL Inspection API gives the real status.
 *
 * Usage:
 *   GSC_TOKEN=ya29... node scripts/measure-indexation.mjs https://yoursite.com
 * (OAuth token with the webmasters.readonly scope — NOT a service account for
 *  ordinary properties; Google rejects SAs in the Search Console UI.)
 */
const SITE = process.argv[2] ?? "https://yoursite.com";
const TOKEN = process.env.GSC_TOKEN;
const CONCURRENCY = 5; // respect the quota: 2000/day + 600/min

if (!TOKEN) {
  console.error("Set GSC_TOKEN (OAuth access token, webmasters.readonly scope)");
  process.exit(1);
}

async function sitemapUrls(site) {
  const xml = await (await fetch(`${site}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

async function inspect(url) {
  const res = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
    }
  );
  const j = await res.json();
  const r = j?.inspectionResult?.indexStatusResult ?? {};
  return { url, verdict: r.verdict ?? "ERROR", coverage: r.coverageState ?? j?.error?.message };
}

// Simple concurrency pool
async function pool(items, n, fn) {
  const out = [];
  const queue = [...items];
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (queue.length) out.push(await fn(queue.shift()));
    })
  );
  return out;
}

const urls = await sitemapUrls(SITE);
console.log(`Inspecting ${urls.length} URLs (concurrency ${CONCURRENCY})...\n`);
const results = await pool(urls, CONCURRENCY, inspect);

const indexed = results.filter((r) => r.verdict === "PASS").length;
for (const r of results) {
  const icon = r.verdict === "PASS" ? "[OK]" : "[--]";
  console.log(`${icon} ${r.coverage ?? r.verdict}  ${r.url}`);
}
console.log(
  `\n${indexed}/${urls.length} indexed (${Math.round((indexed / urls.length) * 100)}%)`
);
