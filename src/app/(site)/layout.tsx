import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSiteSettings } from "@/lib/cms";
import { psychologistJsonLd } from "@/lib/seo";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      {siteSettings ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(psychologistJsonLd(siteSettings)).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      ) : null}
      <Header siteSettings={siteSettings} />
      <main className="flex-1">{children}</main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
