import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { PageHeader } from "@/components/ui/page-header";
import { PortableContent } from "@/components/ui/portable-content";
import { pageMetadata } from "@/lib/seo";
import { getPricingPage } from "@/lib/cms";
import styles from "./styles.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Session fees and out-of-network insurance details for therapy with Dr. Christina Ruzicka in Rochester, NY.",
  path: "/pricing",
});

export default async function Pricing() {
  const pricing = await getPricingPage();
  if (!pricing) notFound();

  return (
    <div className={styles.root}>
      <PageHeader
        eyebrow={pricing.eyebrow}
        heading={pricing.heading}
        intro={pricing.intro}
        sectionSize="spacious"
        layout="grid"
        headingWidth="sm"
      >
        <div className={styles.pricingCard}>
          {/* fees */}
          {pricing.fees ? (
            <div className={styles.feesPanel}>
              <h2 className={styles.feesHeading}>{pricing.fees.heading}</h2>
              <div className={styles.feesList}>
                {pricing.fees.items?.map((item) => (
                  <div key={item.label} className={styles.feeRow}>
                    <div>
                      <div className={styles.feeLabel}>{item.label}</div>
                      <div className={styles.feeDetail}>{item.detail}</div>
                    </div>
                    <div className={styles.feePrice}>{item.price}</div>
                  </div>
                ))}
              </div>
              <p className={styles.feeNote}>{pricing.fees.note}</p>
            </div>
          ) : null}

          {/* insurance */}
          {pricing.insurance ? (
            <div className={styles.insurancePanel}>
              <h2 className={styles.insuranceHeading}>
                {pricing.insurance.heading}
              </h2>
              <PortableContent
                value={pricing.insurance.body}
                className={styles.insuranceBody}
              />
            </div>
          ) : null}
        </div>
      </PageHeader>

      {/* CTA */}
      {pricing.cta ? (
        <CtaBand
          heading={pricing.cta.heading}
          body={pricing.cta.body}
          cta={pricing.cta.cta}
          href="/contact"
          event="consultation_cta_click"
          backgroundImage={pricing.cta.backgroundImage}
        />
      ) : null}
    </div>
  );
}
