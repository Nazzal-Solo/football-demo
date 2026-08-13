import type { NextConfig } from "next";

/**
 * Next.js 16.3.0 supported config:
 * Set `devIndicators` to `false` to hide the on-screen Dev Tools indicator.
 * @see node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/devIndicators.md
 *
 * Note: runtime/compile errors can still surface through Next DevTools.
 * Fix app errors; do not CSS-hide the badge.
 */
const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
