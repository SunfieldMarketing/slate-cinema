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
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
