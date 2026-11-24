import { AuthorCard } from "@/components/author-card";
import { ContentSection } from "@/components/content-section";
import { JsonLd } from "@/components/json-ld";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PortableContent } from "@/components/portable-content";
import { Stack } from "@/components/stack";
import { Heading, Text } from "@/components/typography";
import { reviewedPageJsonLd } from "@/config/seo";
import { PRACTITIONER_LICENSE } from "@/config/site";
import { lastReviewedFor } from "@/config/review-dates";
import type { AboutPageContent, ResourcesPageContent } from "@/data/cms";

/** Stamped on user approval 15 Nov 2026. */
export function ResourcesPage({
  resources,
  about,
}: {
  resources: ResourcesPageContent;
  about: AboutPageContent | null;
}) {
  return (
    <PageShell>
      {about?.heading ? (
        <JsonLd
          data={reviewedPageJsonLd({
            path: "/resources",
            name: resources.heading,
          })}
        />
      ) : null}
      <PageHeader>
        <PageHeaderContent variant="editorial">
          {resources.eyebrow ? (
            <PageHeaderEyebrow>{resources.eyebrow}</PageHeaderEyebrow>
          ) : null}
          <PageHeaderTitle>{resources.heading}</PageHeaderTitle>
          {resources.intro ? (
            <PageHeaderDescription>{resources.intro}</PageHeaderDescription>
          ) : null}
        </PageHeaderContent>
      </PageHeader>

      <ContentSection size="spacious" containerSize="md">
        <Stack gap="xl">
          {about?.heading ? (
            <AuthorCard
              label="Reviewed by"
              aria-label="Page reviewer"
              name={about.heading}
              credentials={about.credentials}
              license={PRACTITIONER_LICENSE.label}
              reviewedOn={lastReviewedFor("/resources")}
              image={about.portraitImage}
              href="/about"
            />
          ) : null}
          {resources.note ? <Text variant="lead">{resources.note}</Text> : null}
          {resources.sections.map((section) => (
            <Stack as="section" gap="sm" key={section._key ?? section.heading}>
              <Heading as="h2" size="section">
                {section.heading}
              </Heading>
              <PortableContent value={section.body} variant="article" />
            </Stack>
          ))}
          {resources.moreHeading && resources.moreBody?.length ? (
            <Stack as="section" gap="sm">
              <Heading as="h2" size="section">
                {resources.moreHeading}
              </Heading>
              <PortableContent value={resources.moreBody} variant="article" />
            </Stack>
          ) : null}
        </Stack>
      </ContentSection>
    </PageShell>
  );
}
