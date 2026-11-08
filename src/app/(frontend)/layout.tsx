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
import { DEFAULT_DESCRIPTION, DEFAULT_SHARE_IMAGE, DEFAULT_TITLE } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { brandColor } from "@/lib/brand";
import { SOCIAL_PROFILES } from "@/lib/social-profiles";
import { draftMode } from 'next/headers';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-fraunces" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier" });


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
  const title = settings.seo?.defaultTitle || DEFAULT_TITLE
  const description = settings.seo?.defaultDescription || DEFAULT_DESCRIPTION
  const ogImage = mediaUrl(settings.seo?.ogImage) || DEFAULT_SHARE_IMAGE

  return {
    metadataBase: new URL(SITE_URL),
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
      url: SITE_URL,
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
  // No preload of the local hero video here (removed 2026-11-03, Oct 27
  // audit #1): while HERO_MASTER_REEL_VIMEO_ID is set the homepage hero is
  // the Vimeo embed, so this hinted a 42MB download on every page --
  // /journal, /contact, the legal pages -- that nothing ever played.
  // See the matching note in Hero.tsx.

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

  // Site-wide structured data (2026-11-07, Levi's AI-search list #2): one named entity --
  // `#organization`, which journal posts and other pages reference as author/publisher -- with
  // its services, service area and official profiles, plus the WebSite it publishes. It replaces
  // a lone ProfessionalService block. Contact facts come from Site Settings so they stay true
  // if that copy changes in /admin; the profile links are shared with the footer (src/lib/social-profiles.ts).
  const contact = settings.contact
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': `${SITE_URL}/#organization`,
        name: 'Slate Cinema',
        description: settings.seo?.defaultDescription || DEFAULT_DESCRIPTION,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo-mark.webp`,
        image: `${SITE_URL}/images/logo-mark.webp`,
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
        areaServed: [
          { '@type': 'City', name: 'New York' },
          { '@type': 'Country', name: 'United States' },
        ],
        knowsAbout: ['Video production', 'Video editing', 'Post-production', 'Social media management', 'Video marketing'],
        priceRange: '$$',
        sameAs: SOCIAL_PROFILES.map((p) => p.href),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Slate Cinema',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${bebas.variable} ${fraunces.variable} ${courier.variable}`}
      // Site Settings > Brand color, over globals.css's --color-brand-blue.
      style={{ ['--color-brand-blue' as string]: brandColor(settings.theme?.brandColor) }}
    >
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
        {/* Industries go to every page (menu, wheel); each one's Sections list
            and search settings only matter on its own page, which loads them. */}
        <SiteDataProvider value={{ navigation, footer, industries: industries.map((industry) => ({ ...industry, layout: undefined, seo: undefined })), settings }}>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </SiteDataProvider>
      </body>
    </html>
  );
}
