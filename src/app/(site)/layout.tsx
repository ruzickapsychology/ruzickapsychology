import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getSiteSettings } from "@/lib/cms";
import { psychologistJsonLd } from "@/lib/seo";
import styles from "./styles.module.css";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <div className={styles.shell}>
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
      <main className={styles.main}>{children}</main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
