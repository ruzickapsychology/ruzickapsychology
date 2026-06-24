import type { Metadata } from "next";
import { Libre_Baskerville, Manrope, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { metadataBase, pageMetadata, psychologistJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/cms";

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase,
  ...pageMetadata({ path: "/" }),
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${baskerville.variable} ${manrope.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        {siteSettings ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(psychologistJsonLd(siteSettings)).replace(/</g, "\\u003c"),
          }}
        />
        ) : null}
        <Header siteSettings={siteSettings} />
        <main className="flex-1">{children}</main>
        <Footer siteSettings={siteSettings} />
        <Analytics />
      </body>
    </html>
  );
}
