import type { NextConfig } from "next";

// trailingSlash:false must match your host. A mismatch makes the canonical a
// redirect → Bing/Google mark "can't be indexed" → you drop out of the AI index.
const nextConfig: NextConfig = {
  trailingSlash: false,
};

export default nextConfig;
