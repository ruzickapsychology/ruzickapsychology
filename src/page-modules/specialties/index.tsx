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
import { Section } from "@/components/section";
import { TextLink } from "@/components/text-link";
import { getAvailabilityContext } from "@/config/availability";
import type { SiteSettings, SpecialtiesPageContent } from "@/data/cms";
import { isServiceSlug, serviceHref } from "@/config/services";
import styles from "./styles.module.css";

export function SpecialtiesPage({
  specialties,
  site,
}: {
  specialties: SpecialtiesPageContent;
  site: SiteSettings | null;
}) {
  const acceptingInquiries = !getAvailabilityContext(
    site?.availabilityStatus,
    site?.availabilityMessaging,
  ).isClosed;
  const couplesPageIsPublished = specialties.items.some(
    (service) =>
      service.pageStatus === "published" && service.slug === "couples-therapy",
  );

  return (
    <PageShell>
      <PageHeader>
        <PageHeaderContent>
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
          tone="feature"
          size="default"
          className={styles.modalitySection}
        >
          <BackgroundImageLayer
            image={specialties.modality.backgroundImage}
            sizes="100vw"
          />
          <GridContainer size="xl" className={styles.modalityContainer}>
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
          </GridContainer>
        </Section>
      ) : null}

      <CtaSection
        heading="Ready to talk about what you need?"
        body="Start with a complimentary 15 minute consultation to ask questions and determine whether working together feels like the right fit."
        cta={acceptingInquiries ? "Request a consultation" : undefined}
      />
    </PageShell>
  );
}
