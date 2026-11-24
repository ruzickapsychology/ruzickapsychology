import { BackgroundImageLayer } from "@/components/background-image-layer";
import {
  ContentHeader,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { ContentSection } from "@/components/content-section";
import { CtaSection } from "@/components/cta-section";
import { DividerGrid } from "@/components/divider-grid";
import { GridContainer } from "@/components/grid";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { SpecialtyCard } from "@/components/specialty-card";
import { PortableContent } from "@/components/portable-content";
import { SeasonalGarden } from "@/components/seasonal-garden";
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { getAvailabilityCtaContent } from "@/config/availability";
import type {
  AboutPageContent,
  SiteSettings,
  SpecialtiesPageContent,
} from "@/data/cms";
import { isServiceSlug, serviceHref } from "@/config/services";
import styles from "./styles.module.css";
import { AuthorCard } from "@/components/author-card";
import { JsonLd } from "@/components/json-ld";
import { lastReviewedFor } from "@/config/review-dates";
import { reviewedPageJsonLd } from "@/config/seo";
import { PRACTITIONER_LICENSE } from "@/config/site";

/** "Reviewed by" card + CollectionPage reviewedBy: user instruction 23 Nov 2026 ("fix it all"). */
export function SpecialtiesPage({
  specialties,
  site,
  about = null,
}: {
  specialties: SpecialtiesPageContent;
  site: SiteSettings | null;
  about?: AboutPageContent | null;
}) {
  const cta = getAvailabilityCtaContent({
    status: site?.availabilityStatus,
    messaging: site?.availabilityMessaging,
    consultationLabel: site?.consultationCtaLabel,
    defaults: {
      heading: "Ready to talk about what you need?",
      body: "Start with a complimentary 15 minute consultation to ask questions and determine whether working together feels like the right fit.",
    },
  });
  const couplesPageIsPublished = specialties.items.some(
    (service) =>
      service.pageStatus === "published" && service.slug === "couples-therapy",
  );

  return (
    <PageShell>
      {about?.heading ? (
        <JsonLd
          data={reviewedPageJsonLd({
            path: "/specialties",
            name: specialties.heading,
            type: "CollectionPage",
          })}
        />
      ) : null}
      <PageHeader>
        <PageHeaderContent variant="overview">
          {specialties.eyebrow ? (
            <PageHeaderEyebrow>{specialties.eyebrow}</PageHeaderEyebrow>
          ) : null}
          <PageHeaderTitle>{specialties.heading}</PageHeaderTitle>
          {specialties.intro ? (
            <PageHeaderDescription>{specialties.intro}</PageHeaderDescription>
          ) : null}
        </PageHeaderContent>
      </PageHeader>
      <ContentSection size="spacious" containerSize="xl">
        <DividerGrid twoColumnBreakpoint="md">
          {specialties.items.map((s) => {
            const href =
              s.pageStatus === "published" && isServiceSlug(s.slug)
                ? serviceHref(s.slug)
                : undefined;
            return (
              <SpecialtyCard
                key={s._key ?? s.slug}
                title={s.title}
                summary={s.summary}
                icon={s.icon}
                headingAs="h2"
                variant="botanical-compact"
                href={href}
                note={href ? undefined : "Offered periodically"}
                dataServiceSlug={href ? s.slug : undefined}
              />
            );
          })}
        </DividerGrid>
      </ContentSection>

      {/* modality band */}
      {specialties.modality ? (
        <Section
          id="seasonal-modality"
          tone="feature"
          size="spacious"
          className={styles.modalitySection}
        >
          <BackgroundImageLayer
            image={specialties.modality.backgroundImage}
            readability="light"
            sizes="100vw"
          />
          <GridContainer
            size="xl"
            layout="editorial"
            align="center"
            gap="lg"
            className={styles.modalityContainer}
          >
            <div className={styles.modalityContent}>
              <ContentHeader align="left" gap="none">
                {specialties.modality.eyebrow ? (
                  <ContentHeaderEyebrow>
                    {specialties.modality.eyebrow}
                  </ContentHeaderEyebrow>
                ) : null}
                <ContentHeaderTitle size="module">
                  {specialties.modality.heading}
                </ContentHeaderTitle>
              </ContentHeader>
              <PortableContent
                value={specialties.modality.body}
                className={styles.modalityBody}
              />
              {couplesPageIsPublished ? (
                <TextLink
                  href={serviceHref("couples-therapy")}
                  className={styles.modalityLink}
                >
                  Learn more
                </TextLink>
              ) : null}
            </div>
            <SeasonalGarden />
          </GridContainer>
        </Section>
      ) : null}

      {about?.heading ? (
        <ContentSection size="compact" containerSize="md">
          <AuthorCard
            label="Reviewed by"
            aria-label="Page reviewer"
            name={about.heading}
            credentials={about.credentials}
            license={PRACTITIONER_LICENSE.label}
            reviewedOn={lastReviewedFor("/specialties")}
            image={about.portraitImage}
            href="/about"
          />
        </ContentSection>
      ) : null}

      <CtaSection
        phone={site?.phone}
        heading={cta.heading}
        body={cta.body}
        cta={cta.label}
      />
    </PageShell>
  );
}
