# AEO Next.js Starter

**Make ChatGPT, Perplexity, Claude and Google AI cite your site.** A Next.js (App Router)
starter that ships Answer Engine Optimization (AEO / GEO) out of the box — the same setup
validated in production on real B2B catalogs.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lesalerno/aeo-nextjs-starter)

> Optimizing for Googlebot does **not** put you in ChatGPT. They use different crawlers
> (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot) with different rules. This starter
> handles all of them.

## What's included

- ✅ **`robots.ts`** — allows the 11 AI crawlers explicitly (ChatGPT, Perplexity, Claude, Google-Extended…)
- ✅ **`llms.txt` + `llms-full.txt`** — auto-generated from your data at build time
- ✅ **Clean `.md` page per product** (`scripts/generate-md-pages.mjs`) — answer first, facts in a table, "Updated on" date. This is what AI engines actually consume (Oct 2026 update: most crawlers ignore llms.txt)
- ✅ **Valid JSON-LD** — Organization (consolidated via `@id` + `knowsAbout`), ItemList for price-less catalogs, FAQPage
- ✅ **`sitemap.ts`** with canonical-aligned URLs (no trailing-slash redirect trap)
- ✅ **Metadata** with og:image that actually inherits per route
- ✅ **CI schema gate** (`ci/validate_schema.py`) + GitHub Actions workflow
- ✅ **Measurement scripts** — real indexation (URL Inspection API) and "share of citation" across LLMs

## Quick start

```bash
npx create-next-app --example https://github.com/lesalerno/aeo-nextjs-starter my-site
# or
git clone https://github.com/lesalerno/aeo-nextjs-starter && cd aeo-nextjs-starter
npm install && npm run dev
```

Then:
1. Edit `src/data/categories.mjs` with your real, factual data.
2. Set `NEXT_PUBLIC_SITE_URL` in your env.
3. Deploy. Check `/robots.txt`, `/llms.txt`, `/sitemap.xml`.

## Why each piece matters

| File | Why |
|---|---|
| `app/robots.ts` | AI engines won't cite you if their bots aren't allowed. |
| `scripts/generate-md-pages.mjs` | Writes a clean `.md` version of every product page next to the HTML. Link them from llms.txt. |
| `scripts/generate-llms-txt.mjs` | LLMs prefer dense, factual text. This generates it from your source. |
| `src/lib/jsonld.ts` | Helps the LLM resolve your entity and trust you as a source. |
| `next.config.ts` (`trailingSlash:false`) | A canonical/redirect mismatch silently removes you from the index. |
| `scripts/check-citation.mjs` | "Share of citation" is the real AEO metric — measure it weekly. |

## Want the full method?

This starter is the **code**. The **strategy, the 5 production lessons, the audit checklist,
the prompt pack and a commercial kit to resell AEO audits** are in the companion ebook:

➡️ **[AEO in Practice — get the ebook + full toolkit](https://leandrooliveira.gumroad.com/l/wzjoct)**
(PT-BR version: [austhen.com.br/aeo-na-pratica](https://austhen.com.br/aeo-na-pratica))

## License

MIT. Build commercial sites with it freely. A ⭐ on the repo helps other devs find it.

---

Made by [Leandro Salerno](https://austhen.com.br) · Austhen
