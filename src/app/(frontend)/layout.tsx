import type { Metadata } from "next";
import { Inter, Bebas_Neue, Fraunces, Courier_Prime } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import ScrollRestoration from "@/components/ScrollRestoration";
import RefreshRouteOnSave from "@/components/RefreshRouteOnSave";
import LivePreviewClickToEdit from "@/components/LivePreviewClickToEdit";
import PostHogInit from "@/components/PostHogInit";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import { SiteDataProvider } from "@/lib/site-data-context";
import { getNavigation, getFooterGlobal, getSiteSettings, mediaUrl } from "@/lib/payload-data";
import { getNormalizedIndustries } from "@/lib/normalize";
import { preload } from 'react-dom';
import { draftMode } from 'next/headers';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-fraunces" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://slatecinema.com'

// Time-based revalidation for every route under this layout that doesn't
// set its own `revalidate`. Without this, every page here is fully
// static (Payload's local API is a direct DB call, not a `fetch()`, so
// it never participates in Next's data cache -- Next just treats the
// whole route as static at build time instead). That's the exact,
// repeatedly-hit bug behind "I fixed the CMS data but it's not showing
// up on the live site": a plain content/media edit through /admin never
// appears until the next full redeploy regenerates the page. 5 minutes
// keeps most of the performance benefit of static rendering while
// making that class of bug self-heal instead of requiring a redeploy.
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings.seo?.defaultTitle || "Slate Cinema | Video Marketing at Your Fingertips"
  const description =
    settings.seo?.defaultDescription ||
    "From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY."
  const ogImage = mediaUrl(settings.seo?.ogImage)

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: settings.seo?.titleTemplate || "%s | Slate Cinema",
    },
    description,
    icons: {
      icon: '/images/logo-mark.webp',
      apple: '/images/logo-mark.webp',
    },
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: "Slate Cinema",
      locale: "en_US",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preload('/videos/hero.mp4', { as: 'video', fetchPriority: 'high' });

  // Draft Mode (set by /api/preview, which every Live Preview iframe URL
  // routes through -- see payload.config.ts's livePreviewURL) is a
  // cookie, so it's readable here in the root layout even though
  // layout.tsx never receives searchParams -- unlike the page-specific
  // ?draft=true a page.tsx could read, this is what lets shared globals
  // (Nav, Footer, SiteSettings -- e.g. TrustBanner) preview a draft too.
  const draft = (await draftMode()).isEnabled
  const [navigation, footer, industries, settings] = await Promise.all([
    getNavigation(draft),
    getFooterGlobal(draft),
    getNormalizedIndustries(draft),
    getSiteSettings(draft),
  ])

  // Organization/LocalBusiness structured data — sourced from Site
  // Settings (contact info) rather than hardcoded, so it stays truthful
  // if that copy ever changes through /admin.
  const contact = settings.contact
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Slate Cinema',
    description: settings.seo?.defaultDescription,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo-mark.webp`,
    image: `${BASE_URL}/images/logo-mark.webp`,
    email: contact?.email,
    telephone: contact?.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact?.addressLine,
      addressLocality: contact?.city,
      addressRegion: contact?.state,
      postalCode: contact?.postalCode,
      addressCountry: 'US',
    },
    areaServed: 'US',
    priceRange: '$$',
  }

  return (
    <html lang="en" className={`dark ${inter.variable} ${bebas.variable} ${fraunces.variable} ${courier.variable}`}>
      <head>
        {/* Every Vimeo embed on the site (background heroes + the
            click-to-watch project modal) hits these same three hosts.
            Nothing here previously warmed the connection, so the first
            embed on any page paid full DNS+TLS+TCP negotiation cold --
            part of why clicking a video to watch it feels slow. */}
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://f.vimeocdn.com" />
      </head>
      <body className="font-sans antialiased bg-ink text-foreground overflow-x-hidden">
        <RefreshRouteOnSave />
        <LivePreviewClickToEdit />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ScrollRestoration />
        <PostHogInit />
        <GoogleAdsTag />
        <SiteDataProvider value={{ navigation, footer, industries, settings }}>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </SiteDataProvider>
      </body>
    </html>
  );
}
