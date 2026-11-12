import { ContentSection } from "@/components/content-section";
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
import type { ResourcesPageContent } from "@/data/cms";

export function ResourcesPage({
  resources,
}: {
  resources: ResourcesPageContent;
}) {
  return (
    <PageShell>
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
