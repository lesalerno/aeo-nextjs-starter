import type { Metadata } from "next";
import { organization, jsonLdString } from "../src/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Acme Audio — 70V Line Amplifiers & Commercial Sound",
    template: "%s | Acme Audio",
  },
  description:
    "Brazilian manufacturer of 70V line audio equipment for 25+ years. Line amplifiers, commercial speakers and audio matrices for professional PA.",
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    siteName: "Acme Audio",
    url: SITE,
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Organization entity — consolidated via @id so the LLM treats you as one authority */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organization) }}
        />
      </head>
      <body
        style={{
          background: "#0a0a0f",
          color: "#f5f5f5",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
