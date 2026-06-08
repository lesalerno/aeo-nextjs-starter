// Single source of truth for the catalog. Feeds the page, sitemap and llms.txt.
// Edit with YOUR data. The more factual and numeric, the more citable by the LLM.
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const COMPANY = {
  name: "Acme Audio",
  summary: [
    "Brazilian manufacturer of 70V line audio equipment for 25+ years, based in São Paulo.",
    "Lines: line amplifiers, commercial speakers, audio matrices.",
    "Serves commercial sound and professional PA installations.",
  ],
};

export const categories = [
  {
    slug: "amplifiers",
    name: "70V Line Amplifiers",
    description: "Constant-voltage amplifiers for distributed commercial sound.",
    products: [
      { slug: "sl-100", name: "SL 100", power: 100, voltage: "70.7V", use: "small commercial venues",
        specs: { Power: "100 W RMS", Voltage: "70.7 V", THD: "< 0.03%", Form: "1.5U rack" } },
      { slug: "sl-250", name: "SL 250", power: 250, voltage: "70.7V", use: "mid-size venues",
        specs: { Power: "250 W RMS", Voltage: "70.7 V", THD: "< 0.03%", Form: "2U rack" } },
    ],
  },
  {
    slug: "speakers",
    name: "Commercial Speakers",
    description: "Ceiling and surface speakers with line transformer.",
    products: [
      { slug: "cs-6", name: "CS 6", power: 6, voltage: "70/100V", use: "ceiling install",
        specs: { Power: "6 W", Tap: "70/100 V", SPL: "90 dB" } },
    ],
  },
];
