import type { Route } from "next";
import {
  ContentHeader,
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
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Stack } from "@/components/stack";
import { TextLink } from "@/components/text-link";
import { Text } from "@/components/typography";
import { getAvailabilityCtaContent } from "@/config/availability";
import { researchHubJsonLd } from "@/config/seo";
import type { HomePageContent, SiteSettings } from "@/data/cms";
import type { ResearchPageContent, ResearchSource } from "@/data/research";
import { formatResearchDate } from "@/lib/research-text";
import styles from "./styles.module.css";

export function ResearchHubPage({
  pages,
  sources,
  ctaContent,
  site,
}: {
  pages: readonly ResearchPageContent[];
  sources: ReadonlyArray<ResearchSource & { pages: string[] }>;
  ctaContent?: HomePageContent["cta"];
  site?: SiteSettings | null;
}) {
  const cta = site
    ? getAvailabilityCtaContent({
        status: site.availabilityStatus,
        messaging: site.availabilityMessaging,
        consultationLabel: site.consultationCtaLabel,
        defaults: { heading: ctaContent?.heading, body: ctaContent?.body },
      })
    : null;

  return (
    <PageShell>
      <JsonLd data={researchHubJsonLd(pages)} />
      <PageHeader>
        <PageHeaderContent variant="overview">
          <PageHeaderEyebrow>Research</PageHeaderEyebrow>
          <PageHeaderTitle>
            Mental health data for Rochester and Monroe County
          </PageHeaderTitle>
          <PageHeaderDescription>
            Short data studies on the people this practice serves: adults,
            couples and new parents in Rochester, Monroe County and across New
            York. Each one is built from public records, and every figure names
            its source and the period it covers.
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>

      <ContentSection size="spacious" containerSize="xl">
        <ContentHeader align="left" gap="none">
          <ContentHeaderEyebrow variant="overline">
            Latest research
          </ContentHeaderEyebrow>
          <ContentHeaderTitle>Studies and statistics</ContentHeaderTitle>
        </ContentHeader>
        <EditorialLinkCardGrid className={styles.cards}>
          {pages.map((page) => (
            <EditorialLinkCard
              key={page.slug}
              href={`/research/${page.slug}` as Route}
              eyebrow={page.kind === "study" ? "Data study" : "Statistics"}
              title={page.title}
              description={
                <>
                  <span className={styles.cardValue}>{page.card.value}</span>{" "}
                  {page.card.label}. {page.card.summary}
                </>
              }
              action={`Published ${formatResearchDate(page.datePublished)} →`}
            />
          ))}
        </EditorialLinkCardGrid>
      </ContentSection>

      <ContentSection tone="muted" size="spacious" containerSize="md">
        <Stack gap="md">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              How we work
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>About this research</ContentHeaderTitle>
          </ContentHeader>
          <Text>
            Every number on these pages is calculated by a script from files
            published by government agencies, such as the New York State
            Education Department, the New York State Department of Health, the
            U.S. Census Bureau and the CDC. Each page lists its sources, the
            period the data covers and the limits of what the data can show.
          </Text>
          <Text>
            The studies describe populations and services. They are not medical
            advice and they do not use any client information. You are welcome
            to reuse the data under a Creative Commons Attribution 4.0 license;
            each study has a CSV download and a suggested citation.
          </Text>
          <Text>
            If you are in crisis, call or text 988, or call 911 in an emergency.
            Local crisis and pregnancy support lines are on the{" "}
            <TextLink href="/resources" variant="inline">
              resources page
            </TextLink>
            .
          </Text>
        </Stack>
      </ContentSection>

      <ContentSection size="spacious" containerSize="md">
        <Stack gap="md">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              Sources
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>Data sources used</ContentHeaderTitle>
          </ContentHeader>
          <ul className={styles.sources}>
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sourceLink}
                >
                  {source.name}
                </a>
                <Text as="span" variant="detail" tone="subdued">
                  {source.period}. Used in: {source.pages.join("; ")}
                </Text>
              </li>
            ))}
          </ul>
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
