/**
 * AEO Boilerplate — scripts/check-citation.mjs
 * Measures "share of citation": how often an LLM cites your brand/domain on
 * questions in your category. The new AEO metric.
 *
 * Runs a set of questions against the Anthropic API with web search and counts
 * how many answers cite your domain. Run it weekly and track the curve.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/check-citation.mjs
 */
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MY_DOMAIN = "yoursite.com";
const MY_BRAND = "Your Company";

// Questions a real customer would ask — edit for YOUR category.
const QUESTIONS = [
  "What are the best manufacturers of [your product]?",
  "Where can I buy [your product]? List suppliers.",
  "Compare options for [your category] for professional use.",
  "Which [product] should I choose for [typical use case]?",
];

if (!API_KEY) {
  console.error("Set ANTHROPIC_API_KEY");
  process.exit(1);
}

async function ask(q) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
      messages: [{ role: "user", content: q }],
    }),
  });
  const j = await res.json();
  const text = (j.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  const cited =
    text.toLowerCase().includes(MY_DOMAIN.toLowerCase()) ||
    text.toLowerCase().includes(MY_BRAND.toLowerCase());
  return { q, cited };
}

let hits = 0;
for (const q of QUESTIONS) {
  const r = await ask(q);
  if (r.cited) hits++;
  console.log(`${r.cited ? "[CITED]  " : "[absent] "} ${q}`);
}
console.log(
  `\nShare of citation: ${hits}/${QUESTIONS.length} (${Math.round(
    (hits / QUESTIONS.length) * 100
  )}%)`
);
