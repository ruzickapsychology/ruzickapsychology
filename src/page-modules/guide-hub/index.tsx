import type { Route } from "next";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { ContentSection } from "@/components/content-section";
import { CtaSection } from "@/components/cta-section";
import {
  EditorialLinkCard,
  EditorialLinkCardGrid,
} from "@/components/editorial-link-card";
import { JsonLd } from "@/components/json-ld";
import { LinkedText } from "@/components/linked-text";
import {
  PageHeader,
  PageHeaderBreadcrumbs,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Stack } from "@/components/stack";
import { getAvailabilityCtaContent } from "@/config/availability";
import { guideHubJsonLd } from "@/config/seo";
import type { SiteSettings } from "@/data/cms";
import type { GuideContent, GuidePageContent } from "@/data/guides";
import { GUIDE_SAFETY_NOTE, GUIDE_STAGE_LABELS, guidePath } from "@/lib/guides";
import styles from "./styles.module.css";

const stageTones = ["default", "muted", "default"] as const;

/** Not stamped "Reviewed by": guide pages wait for Dr. Ruzicka's read. */
export function GuideHubPage({
  guide,
  pages,
  site,
}: {
  guide: GuideContent;
  pages: readonly GuidePageContent[];
  site: SiteSettings | null;
}) {
  const path = guidePath(guide.slug);
  const cta = site
    ? getAvailabilityCtaContent({
        status: site.availabilityStatus,
        messaging: site.availabilityMessaging,
        consultationLabel: site.consultationCtaLabel,
        defaults: {
          heading: "Curious whether this could be a fit?",
          body: "Request a consultation to ask questions and talk through what you are looking for.",
        },
      })
    : null;

  return (
    <PageShell>
      <JsonLd data={guideHubJsonLd(guide, pages)} />
      <PageHeader>
        <PageHeaderBreadcrumbs>
          <BreadcrumbTrail
            currentPath={path}
            items={[{ label: "Home", href: "/" }, { label: guide.title }]}
          />
        </PageHeaderBreadcrumbs>
        <PageHeaderContent variant="editorial">
          <PageHeaderEyebrow>{guide.eyebrow}</PageHeaderEyebrow>
          <PageHeaderTitle>{guide.headline}</PageHeaderTitle>
          <PageHeaderDescription>{guide.intro}</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>

      <ContentSection size="compact" containerSize="md">
        <div className={styles.notice}>
          <LinkedText text={GUIDE_SAFETY_NOTE} variant="supporting" />
        </div>
      </ContentSection>

      {guide.stages.map((stage, index) => {
        const stagePages = pages.filter((page) => page.stage === stage.stage);
        if (!stagePages.length) return null;
        return (
          <ContentSection
            key={stage.stage}
            tone={stageTones[index] ?? "default"}
            size="spacious"
            containerSize="xl"
          >
            <ContentHeader align="left" gap="none" width="lg">
              <ContentHeaderEyebrow variant="overline">
                {stage.eyebrow}
              </ContentHeaderEyebrow>
              <ContentHeaderTitle>{stage.heading}</ContentHeaderTitle>
              <ContentHeaderDescription>
                {stage.description}
              </ContentHeaderDescription>
            </ContentHeader>
            <EditorialLinkCardGrid className={styles.cards}>
              {stagePages.map((page) => (
                <EditorialLinkCard
                  key={page.slug}
                  href={guidePath(guide.slug, page.slug) as Route}
                  eyebrow={GUIDE_STAGE_LABELS[page.stage]}
                  title={page.title}
                  description={page.summary}
                  action="Read →"
                />
              ))}
            </EditorialLinkCardGrid>
          </ContentSection>
        );
      })}

      <ContentSection tone="feature" size="spacious" containerSize="md">
        <Stack gap="md">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              About this guide
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>
              {guide.practiceNote.heading}
            </ContentHeaderTitle>
          </ContentHeader>
          {guide.practiceNote.paragraphs.map((paragraph) => (
            <LinkedText key={paragraph} text={paragraph} />
          ))}
        </Stack>
      </ContentSection>

      {cta?.heading ? (
        <CtaSection
          phone={site?.phone}
          heading={cta.heading}
          body={cta.body}
          cta={cta.label}
          href="/contact"
        />
      ) : null}
    </PageShell>
  );
}
