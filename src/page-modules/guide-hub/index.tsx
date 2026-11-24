import type { Route } from "next";
import { ActionGroup } from "@/components/action-group";
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
import { Heading } from "@/components/typography";
import { TextLink } from "@/components/text-link";
import { getAvailabilityCtaContent } from "@/config/availability";
import { guideHubJsonLd } from "@/config/seo";
import { serviceHref } from "@/config/services";
import type { SiteSettings } from "@/data/cms";
import type { GuideContent, GuidePageContent } from "@/data/guides";
import { GUIDE_SAFETY_NOTE, GUIDE_STAGE_LABELS, guidePath } from "@/lib/guides";
import styles from "./styles.module.css";
import { AuthorCard } from "@/components/author-card";
import { lastReviewedFor } from "@/config/review-dates";
import { PRACTITIONER_LICENSE } from "@/config/site";
import type { AboutPageContent } from "@/data/cms";

const stageTones = ["default", "muted", "default"] as const;

/** Split a stage's pages into its named groups, keeping any leftovers last. */
function groupPages(
  groups: GuideContent["stages"][number]["groups"],
  pages: readonly GuidePageContent[],
): Array<{ heading?: string; pages: GuidePageContent[] }> {
  if (!groups?.length) return [{ pages: [...pages] }];
  const used = new Set<string>();
  const result: Array<{ heading?: string; pages: GuidePageContent[] }> =
    groups.map((group) => {
      const groupPages = group.slugs
        .map((slug) => pages.find((page) => page.slug === slug))
        .filter((page) => page !== undefined);
      groupPages.forEach((page) => used.add(page.slug));
      return { heading: group.heading, pages: groupPages };
    });
  const rest = pages.filter((page) => !used.has(page.slug));
  if (rest.length) result.push({ heading: "More", pages: rest });
  return result.filter((group) => group.pages.length);
}

/** "Reviewed by" card + CollectionPage reviewedBy: user instruction 23 Nov 2026 ("fix it all"). */
export function GuideHubPage({
  guide,
  pages,
  site,
  about = null,
}: {
  guide: GuideContent;
  pages: readonly GuidePageContent[];
  site: SiteSettings | null;
  about?: AboutPageContent | null;
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
          {about?.heading ? (
            <AuthorCard
              label="Reviewed by"
              aria-label="Page reviewer"
              name={about.heading}
              credentials={about.credentials}
              license={PRACTITIONER_LICENSE.label}
              reviewedOn={lastReviewedFor(path)}
              image={about.portraitImage}
              href="/about"
            />
          ) : null}
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
            {groupPages(stage.groups, stagePages).map((group) => (
              <div key={group.heading ?? "all"} className={styles.group}>
                {group.heading ? (
                  <Heading
                    as="h3"
                    size="module"
                    className={styles.groupHeading}
                  >
                    {group.heading}
                  </Heading>
                ) : null}
                <EditorialLinkCardGrid className={styles.cards}>
                  {group.pages.map((page) => (
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
              </div>
            ))}
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
          body={
            <>
              {cta.body ? (
                <span className={styles.ctaBodyText}>{cta.body}</span>
              ) : null}
              <ActionGroup
                as="span"
                align="center"
                className={styles.ctaSupportLinks}
              >
                <TextLink href={serviceHref("online-postpartum-therapy")}>
                  Sessions by video anywhere in New York
                </TextLink>
                <TextLink href="/pricing">Fees and insurance</TextLink>
              </ActionGroup>
            </>
          }
          cta={cta.label}
          href="/contact"
        />
      ) : null}
    </PageShell>
  );
}
