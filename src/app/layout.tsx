import type { Metadata } from "next";
import { Inter, Bebas_Neue, Fraunces, Courier_Prime, Caveat } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import ScrollRestoration from "@/components/ScrollRestoration";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-fraunces" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier" });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-caveat" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://slatecinema.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Slate Cinema | Video Marketing at Your Fingertips",
    template: "%s | Slate Cinema",
  },
  description: "From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.",
  icons: {
    icon: '/images/logo-mark.png',
    apple: '/images/logo-mark.png',
  },
  openGraph: {
    title: "Slate Cinema | Video Marketing at Your Fingertips",
    description: "From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.",
    url: BASE_URL,
    siteName: "Slate Cinema",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Slate Cinema | Video Marketing at Your Fingertips",
    description: "From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.",
  },
};

import { preload } from 'react-dom';

// Organization/LocalBusiness structured data — every field here is sourced
// straight from what's already live in the site's own copy (StudioLocation
// in ContactPageContent.tsx), nothing invented, so it stays truthful if
// that copy ever changes.
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Slate Cinema',
  description: 'From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement.',
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo-mark.png`,
  image: `${BASE_URL}/images/logo-mark.png`,
  email: 'info@slatecinema.com',
  telephone: '+17329301934',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '132 32nd St',
    addressLocality: 'Brooklyn',
    addressRegion: 'NY',
    postalCode: '11232',
    addressCountry: 'US',
  },
  areaServed: 'US',
  priceRange: '$$',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preload('/videos/hero.mp4', { as: 'video', fetchPriority: 'high' });

  return (
    <html lang="en" className={`dark ${inter.variable} ${bebas.variable} ${fraunces.variable} ${courier.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased bg-ink text-foreground overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ScrollRestoration />
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
