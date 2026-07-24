import { BackgroundImageLayer } from "@/components/background-image-layer";
import { buttonVariants } from "@/components/button";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { ContentSection } from "@/components/content-section";
import { DividerGrid } from "@/components/divider-grid";
import { HeaderSentinel } from "@/components/header-sentinel";
import {
  ImmersivePageHeader,
  ImmersivePageHeaderContent,
} from "@/components/immersive-page-header";
import { PageShell } from "@/components/page-shell";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { Eyebrow, Heading, Text } from "@/components/typography";
import { getAvailabilityContext } from "@/config/availability";
import type { ContactPageContent, SiteSettings } from "@/data/cms";
import { cn } from "@/lib/class-names";
import { ContactForm } from "./contact-form";
import styles from "./styles.module.css";

export function ContactPage({
  contact,
  site,
  initialInterest,
}: {
  contact: ContactPageContent;
  site: SiteSettings;
  initialInterest?: string;
}) {
  const availability = getAvailabilityContext(
    site.availabilityStatus,
    site.availabilityMessaging,
  );
  const closedCopy = availability.isClosed
    ? site.availabilityMessaging?.closed
    : null;
  const contactHeading = availability.isDefault
    ? contact.heading
    : availability.copy?.contactHeading;
  const contactIntro = availability.isDefault
    ? contact.intro
    : availability.copy?.contactIntro;

  return (
    <PageShell>
      <ImmersivePageHeader
        className={cn(styles.header, styles.headerWash, styles.imageGrain)}
        media={
          <BackgroundImageLayer
            image={contact.headerBackgroundImage}
            alt=""
            eager
          />
        }
      >
        <ImmersivePageHeaderContent className={styles.headerGrid}>
          <ContentHeader
            tone="inverse"
            align="left"
            gap="none"
            width="md"
            className={styles.headerCopy}
          >
            <ContentHeaderEyebrow>{contact.eyebrow}</ContentHeaderEyebrow>
            <ContentHeaderTitle as="h1" size="display">
              {contactHeading}
            </ContentHeaderTitle>
            {contactIntro ? (
              <ContentHeaderDescription>
                {contactIntro}
              </ContentHeaderDescription>
            ) : null}
            <div className={styles.contactMethods}>
              {availability.isClosed && closedCopy?.contactMethodsLabel ? (
                <Eyebrow as="div" variant="overline" tone="inverse">
                  {closedCopy?.contactMethodsLabel}
                </Eyebrow>
              ) : null}
              <Text as="div" tone="inverse">
                <TrackedExternalLink
                  href={`mailto:${site.email}`}
                  event="email_click"
                  target="_self"
                  className={styles.contactLink}
                >
                  {site.email}
                </TrackedExternalLink>
              </Text>
              {site.phone ? (
                <Text as="div" tone="inverse">
                  <TrackedExternalLink
                    href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                    event="phone_click"
                    target="_self"
                    className={styles.contactLink}
                  >
                    {site.phone}
                  </TrackedExternalLink>
                </Text>
              ) : null}
            </div>
          </ContentHeader>

          <div className={styles.formColumn}>
            {availability.isClosed ? (
              <div className={styles.availabilityPanel}>
                <ContentHeader tone="inverse" align="left" gap="none">
                  <ContentHeaderEyebrow variant="label">
                    Availability
                  </ContentHeaderEyebrow>
                  <ContentHeaderTitle size="module">
                    {closedCopy?.panelHeading}
                  </ContentHeaderTitle>
                  {closedCopy?.panelBody ? (
                    <ContentHeaderDescription>
                      {closedCopy.panelBody}
                    </ContentHeaderDescription>
                  ) : null}
                </ContentHeader>
                {site.portalUrl ? (
                  <TrackedExternalLink
                    href={site.portalUrl}
                    event="client_portal_click"
                    className={buttonVariants({
                      variant: "secondary",
                      className: styles.availabilityButton,
                    })}
                  >
                    Existing client portal
                  </TrackedExternalLink>
                ) : null}
              </div>
            ) : (
              <ContactForm
                note={contact.formNote}
                initialInterest={initialInterest}
              />
            )}
          </div>
        </ImmersivePageHeaderContent>
      </ImmersivePageHeader>
      <HeaderSentinel />

      {/* what to expect */}
      {contact.expect ? (
        <ContentSection
          size="spacious"
          tone="feature"
          layout="site"
          containerSize="xl"
          containerClassName={styles.sectionGrid}
        >
          <ContentHeader>
            <ContentHeaderEyebrow>
              {contact.expect.eyebrow}
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>{contact.expect.heading}</ContentHeaderTitle>
          </ContentHeader>
          <DividerGrid columns={4} itemClassName={styles.stepItem}>
            {contact.expect.steps?.map((step) => (
              <div key={step._key ?? step.n}>
                <Eyebrow variant="label" className={styles.stepNumber}>
                  {step.n}
                </Eyebrow>
                <Heading as="h3" size="item" className={styles.stepTitle}>
                  {step.title}
                </Heading>
                <Text variant="detail">{step.body}</Text>
              </div>
            ))}
          </DividerGrid>
        </ContentSection>
      ) : null}

      {/* location + hours */}
      <ContentSection
        size="spacious"
        layout="site"
        containerSize="xl"
        containerClassName={styles.sectionGrid}
      >
        <div className={styles.detailsGrid}>
          <div className={styles.detailsPanel}>
            <Eyebrow as="div" variant="label" className={styles.detailLabel}>
              Location
            </Eyebrow>
            <Text tone="default">
              {site.address.streetAddress}
              <br />
              {site.address.addressLocality}, {site.address.addressRegion}{" "}
              {site.address.postalCode}
              <br />
              <Text as="span" variant="detail" tone="subdued">
                {site.address.note}
              </Text>
            </Text>
          </div>
          <div aria-hidden className={styles.detailDivider} />
          <div className={styles.detailsPanel}>
            <Eyebrow as="div" variant="label" className={styles.detailLabel}>
              Hours
            </Eyebrow>
            <Text>
              {site.hours.map((h) => (
                <span key={h}>
                  {h}
                  <br />
                </span>
              ))}
            </Text>
          </div>
        </div>
        <div className={styles.mapShell}>
          <iframe
            title={`Map to ${site.name}, ${site.address.streetAddress}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              `${site.address.streetAddress}, ${site.address.addressLocality}, ${site.address.addressRegion} ${site.address.postalCode}`,
            )}&z=14&output=embed`}
            className={styles.map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div aria-hidden className={styles.mapOverlay} />
        </div>
      </ContentSection>
    </PageShell>
  );
}
