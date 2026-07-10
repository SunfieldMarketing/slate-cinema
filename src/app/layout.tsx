import type { Metadata } from "next";
import { Inter, Bebas_Neue, Fraunces, Courier_Prime, Caveat } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-fraunces" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier" });
const caveat = Caveat({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Slate Cinema | Video Marketing at Your Fingertips",
  description: "From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${bebas.variable} ${fraunces.variable} ${courier.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased bg-ink text-foreground overflow-x-hidden">
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
