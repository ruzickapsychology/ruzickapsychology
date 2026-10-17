import { Container } from "@/components/container";
import { BackgroundImageLayer } from "@/components/background-image-layer";
import { CircularPortrait } from "@/components/circular-portrait";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { CtaSection } from "@/components/cta-section";
import { FoldedNote } from "@/components/folded-note";
import {
  DisclosureContent,
  DisclosureItem,
  DisclosureList,
  DisclosureTitle,
  DisclosureTrigger,
} from "@/components/disclosure-list";
import { PageShell } from "@/components/page-shell";
import { Grid, GridContainer } from "@/components/grid";
import { PortableContent } from "@/components/portable-content";
import { Section } from "@/components/section";
import { Eyebrow, Text } from "@/components/typography";
import { imageSrc } from "@/config/cms-images";
import type { AboutPageContent, SiteSettings } from "@/data/cms";
import {
  getAvailabilityContext,
  getAvailabilityCtaContent,
} from "@/config/availability";
import styles from "./styles.module.css";

const newYorkLicenseVerificationUrl =
  "https://www.op.nysed.gov/services/verifications/online-verification-searches";

export function AboutPage({
  about,
  site,
}: {
  about: AboutPageContent;
  site: SiteSettings | null;
}) {
  const availability = getAvailabilityContext(
    site?.availabilityStatus,
    site?.availabilityMessaging,
  );
  const cta = getAvailabilityCtaContent({
    status: availability.status,
    messaging: site?.availabilityMessaging,
    defaults: {
      heading: "Ready to see whether working together feels like a fit?",
      body: "Request a consultation to share what brings you to therapy and ask questions about the process.",
      label: "Request a consultation",
    },
  });

  return (
    <PageShell>
      {/* bio */}
      <Section size="page">
        <GridContainer size="xl" layout="portrait" gap="lg" align="start">
          <CircularPortrait
            image={about.portraitImage}
            alt={about.portraitImage?.alt ?? "Dr. Christina Ruzicka"}
            imageSizes="(min-width: 1024px) 360px, 85vw"
            sticky="lg"
          />
          <ContentHeader align="left" gap="none" width="lg">
            <ContentHeaderEyebrow>{about.credentials}</ContentHeaderEyebrow>
            <ContentHeaderTitle as="h1" size="display">
              {about.heading}
            </ContentHeaderTitle>
            <PortableContent
              value={about.intro}
              variant="intro"
              className={styles.intro}
            />

            {about.credentialGroups?.length ? (
              <DisclosureList className={styles.credentialsList}>
                {about.credentialGroups.map((group) => (
                  <Credentials
                    key={group._key ?? group.heading}
                    group={group}
                    license={group.license}
                  />
                ))}
              </DisclosureList>
            ) : null}
          </ContentHeader>
        </GridContainer>
      </Section>

      {about.intro?.length ? (
        <Section size="spacious" tone="feature" id="before-we-meet">
          <Container size="xl">
            <FoldedNote attribution={about.heading}>
              <PortableContent value={about.intro.slice(0, 2)} variant="body" />
            </FoldedNote>
          </Container>
        </Section>
      ) : null}

      {/* therapy space */}
      {about.space ? (
        <Section size="spacious">
          <Container size="xl">
            <ContentHeader>
              {about.space.eyebrow ? (
                <ContentHeaderEyebrow>
                  {about.space.eyebrow}
                </ContentHeaderEyebrow>
              ) : null}
              <ContentHeaderTitle>{about.space.heading}</ContentHeaderTitle>
              {about.space.body ? (
                <ContentHeaderDescription>
                  {about.space.body}
                </ContentHeaderDescription>
              ) : null}
            </ContentHeader>

            <Grid layout="two" className={styles.spaceGrid}>
              <div className={styles.spaceImageShell}>
                {imageSrc(about.space.exteriorImage) ? (
                  <div className={styles.spaceImageFrame}>
                    <BackgroundImageLayer
                      image={about.space.exteriorImage}
                      alt={about.space.exteriorImage?.alt ?? "Office exterior"}
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className={styles.placeholder}>
                    <div>
                      <Eyebrow variant="label">Exterior Photo</Eyebrow>
                      <Text
                        variant="detail"
                        tone="subdued"
                        className={styles.placeholderBody}
                      >
                        Placeholder for the building exterior.
                      </Text>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.interiorImageShell}>
                <BackgroundImageLayer
                  image={about.space.interiorImage}
                  alt={
                    about.space.interiorImage?.alt ??
                    "Therapy office seating area"
                  }
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </div>
            </Grid>
          </Container>
        </Section>
      ) : null}

      {/* philosophy band (replaces client testimonial — see content note) */}
      {about.philosophy ? (
        <Section
          size="default"
          id="about-quote-band"
          className={styles.quoteSection}
        >
          <BackgroundImageLayer
            image={about.philosophy.backgroundImage}
            sizes="100vw"
          />
          <div className={styles.quoteOverlay} aria-hidden />
          <GridContainer size="xl" className={styles.quoteGrid}>
            <div className={styles.quoteContent}>
              <Eyebrow tone="inverse">{about.philosophy.eyebrow}</Eyebrow>
              <Text variant="quote" tone="inverse" className={styles.quoteText}>
                “{about.philosophy.quote}”
              </Text>
              <Eyebrow
                variant="meta"
                tone="inverse"
                className={styles.quoteAttribution}
              >
                —{about.philosophy.attribution}
              </Eyebrow>
            </div>
          </GridContainer>
        </Section>
      ) : null}

      {!availability.isClosed ? (
        <CtaSection
          phone={site?.phone}
          heading={cta.heading}
          body={cta.body}
          cta={cta.label}
        />
      ) : null}
    </PageShell>
  );
}

function Credentials({
  group,
  license,
}: {
  group: {
    heading: string;
    items: ReadonlyArray<{ _key?: string; title: string; detail: string }>;
  };
  license?: string;
}) {
  return (
    <DisclosureItem>
      <DisclosureTrigger>
        <DisclosureTitle as="h2">{group.heading}</DisclosureTitle>
      </DisclosureTrigger>
      <DisclosureContent spacing={false} className={styles.credentialBody}>
        {group.items.map((item) => (
          <Text
            key={item._key ?? item.title}
            variant="detail"
            className={styles.credentialItem}
          >
            <strong className={styles.credentialTitle}>{item.title}</strong>
            <br />
            {item.detail}
          </Text>
        ))}
        {license ? (
          <Text variant="detail" tone="subdued" className={styles.license}>
            {license}
            <br />
            <a
              href={newYorkLicenseVerificationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify a New York professional license
            </a>
          </Text>
        ) : null}
      </DisclosureContent>
    </DisclosureItem>
  );
}
