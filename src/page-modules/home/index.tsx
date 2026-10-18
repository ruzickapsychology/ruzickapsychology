import Image from "next/image";
import { ActionGroup } from "@/components/action-group";
import { CircularPortrait } from "@/components/circular-portrait";
import {
  ContentHeader,
  ContentHeaderActions,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { CtaSection } from "@/components/cta-section";
import { GridContainer } from "@/components/grid";
import { HeroBadge } from "@/components/hero-badge";
import { HeaderSentinel } from "@/components/header-sentinel";
import {
  ImmersivePageHeader,
  ImmersivePageHeaderContent,
  ImmersivePageHeaderJumpLink,
  ImmersivePageHeaderNavigation,
} from "@/components/immersive-page-header";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { CtaLink } from "@/components/cta-link";
import { imageBlurData, imageSrc } from "@/config/cms-images";
import {
  getAvailabilityBadgeMessages,
  getAvailabilityContext,
  getAvailabilityCtaContent,
} from "@/config/availability";
import type { HomePageContent, SiteSettings } from "@/data/cms";
import { HomeSpecialties } from "./specialties";
import styles from "./styles.module.css";

export function HomePage({
  home,
  site,
}: {
  home: HomePageContent;
  site: SiteSettings | null;
}) {
  const availability = getAvailabilityContext(
    site?.availabilityStatus,
    site?.availabilityMessaging,
  );
  const availabilityBadgeMessages = getAvailabilityBadgeMessages(
    availability.status,
    site?.availabilityBadgeMessages,
  );
  const heroCtaHref = availability.isClosed ? "/specialties" : "/contact";
  const heroCtaEvent = availability.isClosed
    ? "specialties_cta_click"
    : "consultation_cta_click";
  const heroCtaLabel = availability.isDefault
    ? home.hero.cta
    : availability.copy?.heroCta;
  const cta = getAvailabilityCtaContent({
    status: availability.status,
    messaging: site?.availabilityMessaging,
    defaults: {
      heading: home.cta.heading,
      body: home.cta.body,
      label: home.cta.cta,
    },
  });

  const heroImageSrc = imageSrc(home.hero.backgroundImage);
  const heroBlurData = imageBlurData(home.hero.backgroundImage);

  return (
    <PageShell>
      {/* hero */}
      <ImmersivePageHeader
        readability="dark"
        className={styles.hero}
        media={
          heroImageSrc ? (
            <Image
              alt={home.hero.backgroundImage?.alt ?? ""}
              className={styles.heroImage}
              decoding="async"
              fetchPriority="high"
              fill
              loading="eager"
              placeholder={heroBlurData ? "blur" : "empty"}
              blurDataURL={heroBlurData}
              quality={75}
              sizes="100vw"
              src={heroImageSrc}
            />
          ) : null
        }
      >
        <ImmersivePageHeaderContent>
          <div className={styles.heroContent}>
            {availabilityBadgeMessages ? (
              <HeroBadge messages={availabilityBadgeMessages} />
            ) : null}
            <ContentHeader
              tone="inverse"
              gap="none"
              width="lg"
              className={styles.heroText}
            >
              <ContentHeaderEyebrow>{home.hero.kicker}</ContentHeaderEyebrow>
              <ContentHeaderTitle as="h1" size="display">
                {home.hero.heading}
              </ContentHeaderTitle>
              <ContentHeaderDescription>
                {home.hero.body}
              </ContentHeaderDescription>
              {heroCtaLabel ? (
                <ContentHeaderActions>
                  <ActionGroup align="center">
                    <CtaLink
                      href={heroCtaHref}
                      event={heroCtaEvent}
                      variant="primary"
                      tone="inverse"
                    >
                      {heroCtaLabel}
                    </CtaLink>
                  </ActionGroup>
                </ContentHeaderActions>
              ) : null}
            </ContentHeader>
          </div>
        </ImmersivePageHeaderContent>
        <ImmersivePageHeaderNavigation aria-label="Hero navigation">
          <ImmersivePageHeaderJumpLink
            href="#home-specialties"
            aria-label="Continue to therapy specialties"
          >
            ↓
          </ImmersivePageHeaderJumpLink>
        </ImmersivePageHeaderNavigation>
      </ImmersivePageHeader>
      <HeaderSentinel />

      <HomeSpecialties specialties={home.specialties} />

      {/* about preview */}
      <Section size="spacious" tone="feature">
        <GridContainer size="xl" layout="portrait" align="center">
          <CircularPortrait
            image={home.about.portraitImage}
            alt={home.about.portraitImage?.alt ?? "Dr. Christina Ruzicka"}
            size="sm"
            imageSizes="(min-width: 768px) 300px, 80vw"
          />
          <ContentHeader align="centerLeft" width="lg" gap="none">
            <ContentHeaderEyebrow>{home.about.eyebrow}</ContentHeaderEyebrow>
            <ContentHeaderTitle>{home.about.heading}</ContentHeaderTitle>
            <ContentHeaderDescription>
              {home.about.body}
            </ContentHeaderDescription>
            <ContentHeaderActions>
              <TextLink href="/about">{home.about.cta}</TextLink>
            </ContentHeaderActions>
          </ContentHeader>
        </GridContainer>
      </Section>

      {site ? (
        <Section size="default">
          <GridContainer size="xl">
            <ContentHeader align="left" gap="none" className={styles.localCopy}>
              <ContentHeaderEyebrow>
                Therapy in Rochester & New York
              </ContentHeaderEyebrow>
              <ContentHeaderTitle>
                In-person on South Avenue. Virtual throughout New York.
              </ContentHeaderTitle>
              <ContentHeaderDescription>
                Meet with Dr. Christina Ruzicka at {site.address.streetAddress}{" "}
                in Rochester, or ask about virtual appointments available to
                clients located across New York.
              </ContentHeaderDescription>
              <ContentHeaderActions>
                <TextLink href="/contact">
                  View location and get started
                </TextLink>
              </ContentHeaderActions>
            </ContentHeader>
          </GridContainer>
        </Section>
      ) : null}

      {/* CTA band */}
      <CtaSection
        phone={site?.phone}
        heading={cta.heading}
        body={cta.body}
        cta={cta.label}
        backgroundImage={home.cta.backgroundImage}
      />
    </PageShell>
  );
}
