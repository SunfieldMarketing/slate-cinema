import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/portfolio/animation",
        destination: "/portfolio/ai",
        permanent: true,
      },
      // Old-site URLs (bare, no /portfolio prefix) that were 404ing with
      // no redirect -- per client audit 2026-08-12. Mapped to today's
      // closest live equivalent; /thenextride intentionally excluded,
      // pending a decision on whether that page comes back as its own
      // page (it ended in a collections dispute -- see PROJECT_CONTEXT.md).
      { source: "/athletics", destination: "/portfolio/athletics", permanent: true },
      { source: "/education", destination: "/portfolio/education", permanent: true },
      { source: "/organizations", destination: "/portfolio/organizations", permanent: true },
      { source: "/realestate", destination: "/portfolio/real-estate", permanent: true },
      { source: "/ai", destination: "/portfolio/ai", permanent: true },
      { source: "/animation", destination: "/portfolio/ai", permanent: true },
      // No dedicated page yet for these two -- best-fit existing industry
      // rather than a dead link (doc groups Construction with Real Estate,
      // and Hospitality with Travel).
      { source: "/construction", destination: "/portfolio/real-estate", permanent: true },
      { source: "/hospitality", destination: "/portfolio/travel", permanent: true },
      // No Music industry page yet -- general portfolio rather than 404.
      { source: "/music", destination: "/portfolio", permanent: true },
      // Podcasts moved from its own standalone page to a normal industry
      // entry 2026-08-13 ("make the podcasts page just an industry page
      // same format and everything") -- redirect the old URL rather than
      // 404 anyone who bookmarked or shared it.
      { source: "/podcasts", destination: "/portfolio/podcasts", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  // Without this, Turbopack bundles sharp's native addon instead of
  // leaving it as a real node_modules dependency -- the prebuilt
  // linux-x64 binary (libvips-cpp.so) then can't be found at runtime on
  // Vercel. Found 2026-08-19: every single /api/media/file/* request was
  // 500ing sitewide ("Could not load the 'sharp' module using the
  // linux-x64 runtime, ERR_DLOPEN_FAILED").
  serverExternalPackages: ["sharp"],
  // serverExternalPackages alone wasn't enough -- confirmed by redeploying
  // and checking Vercel's runtime error logs directly, same error. The
  // JS import resolves fine (that's what serverExternalPackages fixes),
  // but Next's file tracer still wasn't physically including sharp's
  // native binary packages in the deployed function bundle, so the
  // *file* genuinely wasn't there at runtime. This exact pattern --
  // "node_modules/sharp/**/*" -- is Next's own documented fix for native/
  // runtime assets (node_modules/next/dist/docs/.../output.md). Added the
  // two @img sub-packages explicitly too since they're sharp's actual
  // native binaries and live outside node_modules/sharp/ itself.
  outputFileTracingIncludes: {
    "/*": [
      "node_modules/sharp/**/*",
      "node_modules/@img/sharp-linux-x64/**/*",
      "node_modules/@img/sharp-libvips-linux-x64/**/*",
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
