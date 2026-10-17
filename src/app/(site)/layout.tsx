import { PressedFlower } from "@/components/pressed-flower";
import { SiteFooter } from "@/components/site-footer";
import { SiteAnalytics } from "@/components/site-analytics";
import { SpecialtyMotion } from "@/components/specialty-motion";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { getAboutPage, getSiteSettings } from "@/data/cms";
import { practiceJsonLd } from "@/config/seo";
import styles from "./_layout/styles.module.css";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, about] = await Promise.all([
    getSiteSettings(),
    getAboutPage(),
  ]);
  const licenses = [
    ...new Set(
      about?.credentialGroups
        ?.map((group) => group.license?.trim())
        .filter((license): license is string => Boolean(license)),
    ),
  ];

  return (
    <div className={styles.shell}>
      {siteSettings ? <JsonLd data={practiceJsonLd(siteSettings)} /> : null}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader siteSettings={siteSettings} />
      <SiteAnalytics />
      <SpecialtyMotion />
      <main id="main-content" tabIndex={-1} className={styles.main}>
        {children}
      </main>
      {about?.philosophy?.quote ? (
        <PressedFlower
          quote={about.philosophy.quote}
          attribution={about.philosophy.attribution}
        />
      ) : null}
      <SiteFooter siteSettings={siteSettings} licenses={licenses} />
    </div>
  );
}
