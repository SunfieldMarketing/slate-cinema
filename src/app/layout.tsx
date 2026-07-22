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
    icon: '/images/logo.avif',
    apple: '/images/logo.avif',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preload('/videos/hero.mp4', { as: 'video', fetchPriority: 'high' });

  return (
    <html lang="en" className={`dark ${inter.variable} ${bebas.variable} ${fraunces.variable} ${courier.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased bg-ink text-foreground overflow-x-hidden">
        <ScrollRestoration />
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
