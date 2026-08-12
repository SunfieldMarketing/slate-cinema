import type { Metadata } from "next";
import { Inter, Bebas_Neue, Fraunces, Courier_Prime, Caveat } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import ScrollRestoration from "@/components/ScrollRestoration";
import { SiteDataProvider } from "@/lib/site-data-context";
import { getNavigation, getFooterGlobal, getSiteSettings, mediaUrl } from "@/lib/payload-data";
import { getNormalizedIndustries } from "@/lib/normalize";
import { preload } from 'react-dom';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-fraunces" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier" });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-caveat" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://slatecinema.com'

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

  const [navigation, footer, industries, settings] = await Promise.all([
    getNavigation(),
    getFooterGlobal(),
    getNormalizedIndustries(),
    getSiteSettings(),
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
    <html lang="en" className={`dark ${inter.variable} ${bebas.variable} ${fraunces.variable} ${courier.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased bg-ink text-foreground overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ScrollRestoration />
        <SiteDataProvider value={{ navigation, footer, industries, settings }}>
          <SmoothScrolling>
            {children}
          </SmoothScrolling>
        </SiteDataProvider>
      </body>
    </html>
  );
}
