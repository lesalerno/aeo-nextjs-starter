import { categories, COMPANY } from "../src/data/categories.mjs";
import { catalogItemList, faqPage, jsonLdString } from "../src/lib/jsonld";

const FAQ = [
  {
    q: "What is a 70V line audio system?",
    a: "A constant-voltage (70V/100V) system distributes audio over long cable runs with minimal loss, ideal for commercial sound across many speakers.",
  },
  {
    q: "Where are Acme Audio products manufactured?",
    a: "In São Paulo, Brazil. Acme Audio has manufactured professional audio equipment for over 25 years.",
  },
];

// Flatten products for a demo ItemList (AEO: structured, citable catalog data)
const allProducts = categories.flatMap((c: any) =>
  c.products.map((p: any) => ({ name: p.name, slug: `${c.slug}/${p.slug}` }))
);

export default function Home() {
  const itemList = catalogItemList("catalog", allProducts);
  const faq = faqPage(FAQ);

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "64px 24px" }}>
      {itemList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(itemList) }}
        />
      )}
      {faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }}
        />
      )}

      <p style={{ letterSpacing: 4, color: "#c9a96e", fontSize: 13, textTransform: "uppercase" }}>
        AEO-Optimized Next.js Starter
      </p>
      <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: "12px 0 8px" }}>{COMPANY.name}</h1>
      <p style={{ color: "#bbb", fontSize: 18 }}>{COMPANY.summary[0]}</p>

      <h2 style={{ marginTop: 48, fontSize: 24 }}>Product lines</h2>
      {categories.map((cat: any) => (
        <section key={cat.slug} style={{ marginTop: 24 }}>
          <h3 style={{ color: "#c9a96e" }}>{cat.name}</h3>
          <p style={{ color: "#999" }}>{cat.description}</p>
          <ul>
            {cat.products.map((p: any) => (
              <li key={p.slug}>
                <strong>{p.name}</strong> — {p.power}W, {p.voltage}, {p.use}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <h2 style={{ marginTop: 48, fontSize: 24 }}>FAQ</h2>
      {FAQ.map((f) => (
        <details key={f.q} style={{ margin: "10px 0" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>{f.q}</summary>
          <p style={{ color: "#bbb" }}>{f.a}</p>
        </details>
      ))}

      <footer style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid #222", color: "#777", fontSize: 14 }}>
        AEO checklist: <code>/robots.txt</code> · <code>/llms.txt</code> · <code>/sitemap.xml</code> + JSON-LD above.
        Built with the{" "}
        <a href="https://github.com/lesalerno/aeo-nextjs-starter" style={{ color: "#c9a96e" }}>
          AEO Next.js Starter
        </a>
        .
      </footer>
    </main>
  );
}
