import { TextLink } from "@/components/text-link";
import { Stack } from "@/components/stack";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { ContentSection } from "@/components/content-section";
import { CtaSection } from "@/components/cta-section";
import {
  DisclosureContent,
  DisclosureEyebrow,
  DisclosureItem,
  DisclosureList,
  DisclosureTitle,
  DisclosureTrigger,
} from "@/components/disclosure-list";
import { Grid } from "@/components/grid";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PortableContent } from "@/components/portable-content";
import { Heading, Text } from "@/components/typography";
import { getAvailabilityCtaContent } from "@/config/availability";
import type { PricingPageContent, SiteSettings } from "@/data/cms";
import type { ServicePageDefinition } from "@/config/services";
import { pricingFeeServiceHref } from "@/config/pricing";
import styles from "./styles.module.css";

export function PricingPage({
  pricing,
  site,
  publishedServices,
}: {
  pricing: PricingPageContent;
  site: SiteSettings | null;
  publishedServices: ServicePageDefinition[];
}) {
  const cta = getAvailabilityCtaContent({
    status: site?.availabilityStatus,
    messaging: site?.availabilityMessaging,
    defaults: {
      heading: pricing.cta?.heading,
      body: pricing.cta?.body,
      label: pricing.cta?.cta,
    },
    placement: "pricing",
  });

  const reimbursementGuideItems =
    pricing.reimbursementGuide?.items?.filter((item) => item.title) ?? [];
  const hasReimbursementGuide =
    pricing.reimbursementGuide &&
    (pricing.reimbursementGuide.eyebrow ||
      pricing.reimbursementGuide.heading ||
      pricing.reimbursementGuide.intro ||
      reimbursementGuideItems.length > 0);
  const feeItems = pricing.fees?.items?.map((item) => ({
    ...item,
    href: pricingFeeServiceHref(item.label, publishedServices),
  }));

  return (
    <PageShell>
      <PageHeader>
        <PageHeaderContent width="md">
          {pricing.eyebrow ? (
            <PageHeaderEyebrow>{pricing.eyebrow}</PageHeaderEyebrow>
          ) : null}
          <PageHeaderTitle>{pricing.heading}</PageHeaderTitle>
          {pricing.intro ? (
            <PageHeaderDescription>{pricing.intro}</PageHeaderDescription>
          ) : null}
        </PageHeaderContent>
      </PageHeader>
      <ContentSection size="spacious" containerSize="lg">
        <Grid layout="twoMd" gap="none">
          {/* fees */}
          {pricing.fees ? (
            <div className={styles.feesPanel}>
              <Heading as="h2" size="item" className={styles.feesHeading}>
                {pricing.fees.heading}
              </Heading>
              <Stack gap="md">
                {feeItems?.map((item) => (
                  <div key={item.label} className={styles.feeRow}>
                    <div>
                      <Text as="div">
                        {item.href ? (
                          <TextLink variant="inline" href={item.href}>
                            {item.label}
                          </TextLink>
                        ) : (
                          item.label
                        )}
                      </Text>
                      <Text as="div" variant="detail" tone="subdued">
                        {item.detail}
                      </Text>
                    </div>
                    <Text
                      as="div"
                      variant="lead"
                      tone="accent"
                      className={styles.feeAmount}
                    >
                      {item.price}
                    </Text>
                  </div>
                ))}
              </Stack>
              <Text variant="detail" tone="subdued" className={styles.feeNote}>
                {pricing.fees.note}
              </Text>
            </div>
          ) : null}

          {/* insurance */}
          {pricing.insurance ? (
            <div className={styles.insurancePanel}>
              <Heading as="h2" size="item" className={styles.insuranceHeading}>
                {pricing.insurance.heading}
              </Heading>
              <PortableContent value={pricing.insurance.body} />
            </div>
          ) : null}
        </Grid>
      </ContentSection>

      {hasReimbursementGuide ? (
        <ContentSection tone="feature" size="spacious" containerSize="md">
          {pricing.reimbursementGuide?.heading ? (
            <ContentHeader>
              {pricing.reimbursementGuide.eyebrow ? (
                <ContentHeaderEyebrow>
                  {pricing.reimbursementGuide.eyebrow}
                </ContentHeaderEyebrow>
              ) : null}
              <ContentHeaderTitle>
                {pricing.reimbursementGuide.heading}
              </ContentHeaderTitle>
              {pricing.reimbursementGuide.intro ? (
                <ContentHeaderDescription>
                  {pricing.reimbursementGuide.intro}
                </ContentHeaderDescription>
              ) : null}
            </ContentHeader>
          ) : null}
          {reimbursementGuideItems.length > 0 ? (
            <DisclosureList>
              {reimbursementGuideItems.map((item) => (
                <DisclosureItem key={item._key ?? item.title}>
                  <DisclosureTrigger>
                    {item.eyebrow ? (
                      <DisclosureEyebrow>{item.eyebrow}</DisclosureEyebrow>
                    ) : null}
                    <DisclosureTitle>{item.title}</DisclosureTitle>
                  </DisclosureTrigger>
                  <DisclosureContent>
                    <PortableContent value={item.body} variant="compact" />
                  </DisclosureContent>
                </DisclosureItem>
              ))}
            </DisclosureList>
          ) : null}
        </ContentSection>
      ) : null}

      {/* CTA */}
      {cta.heading ? (
        <CtaSection
          heading={cta.heading}
          body={cta.body}
          cta={cta.label}
          backgroundImage={pricing.cta?.backgroundImage}
        />
      ) : null}
    </PageShell>
  );
}
