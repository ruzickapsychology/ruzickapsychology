import type { Route } from "next";
import { ActionGroup } from "@/components/action-group";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import {
  ContentHeader,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { ContentSection } from "@/components/content-section";
import { CtaSection } from "@/components/cta-section";
import {
  DisclosureContent,
  DisclosureItem,
  DisclosureList,
  DisclosureTitle,
  DisclosureTrigger,
} from "@/components/disclosure-list";
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
import { TextLink } from "@/components/text-link";
import { Eyebrow, Text } from "@/components/typography";
import { getAvailabilityCtaContent } from "@/config/availability";
import { faqPageJsonLd, guidePageJsonLd } from "@/config/seo";
import { serviceHref } from "@/config/services";
import type { SiteSettings } from "@/data/cms";
import type { GuideContent, GuidePageContent } from "@/data/guides";
import { GUIDE_SAFETY_NOTE, GUIDE_STAGE_LABELS, guidePath } from "@/lib/guides";
import { formatResearchDate } from "@/lib/research-text";
import styles from "./styles.module.css";

/** Not stamped "Reviewed by": guide pages wait for Dr. Ruzicka's read. */
export function GuidePage({
  guide,
  page,
  related,
  site,
}: {
  guide: GuideContent;
  page: GuidePageContent;
  related: readonly GuidePageContent[];
  site: SiteSettings | null;
}) {
  const path = guidePath(guide.slug, page.slug);
  const hubPath = guidePath(guide.slug);
  const nextIsContact = page.next.href.startsWith("/contact");
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
      <JsonLd data={guidePageJsonLd(guide, page)} />
      {page.faqs.length ? (
        <JsonLd data={faqPageJsonLd(page.faqs, { path, reviewed: false })} />
      ) : null}

      <PageHeader>
        <PageHeaderBreadcrumbs>
          <BreadcrumbTrail
            currentPath={path}
            items={[
              { label: "Home", href: "/" },
              { label: guide.title, href: hubPath as Route },
              { label: page.title },
            ]}
          />
        </PageHeaderBreadcrumbs>
        <PageHeaderContent variant="editorial">
          <PageHeaderEyebrow>
            {guide.eyebrow} · {GUIDE_STAGE_LABELS[page.stage]}
          </PageHeaderEyebrow>
          <PageHeaderTitle>{page.headline}</PageHeaderTitle>
          <PageHeaderDescription>{page.summary}</PageHeaderDescription>
          <Text variant="detail" className={styles.byline}>
            By Ruzicka Psychology · Published{" "}
            {formatResearchDate(page.datePublished)}
            {page.dateModified !== page.datePublished
              ? ` · Updated ${formatResearchDate(page.dateModified)}`
              : null}
          </Text>
        </PageHeaderContent>
      </PageHeader>

      <ContentSection size="compact" containerSize="md">
        <div data-slot="guide-answer" className={styles.answer}>
          <Eyebrow variant="overline">The short answer</Eyebrow>
          <LinkedText text={page.answer} variant="lead" />
        </div>
      </ContentSection>

      <ContentSection size="spacious" containerSize="md">
        <Stack gap="xl">
          {page.sections.map((section) => (
            <Stack as="section" gap="md" key={section.heading}>
              <ContentHeader align="left" gap="none">
                <ContentHeaderTitle>{section.heading}</ContentHeaderTitle>
              </ContentHeader>
              {section.paragraphs.map((paragraph) => (
                <LinkedText key={paragraph} text={paragraph} />
              ))}
              {section.items?.length ? (
                <ul className={styles.items}>
                  {section.items.map((item) => (
                    <li key={item}>
                      <LinkedText text={item} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </Stack>
          ))}
          <div className={styles.notice}>
            <LinkedText text={GUIDE_SAFETY_NOTE} variant="supporting" />
          </div>
        </Stack>
      </ContentSection>

      <ContentSection tone="muted" size="compact" containerSize="md">
        <EditorialLinkCard
          href={page.next.href as Route}
          eyebrow="Next step"
          title={page.next.label}
          description={page.next.text}
          action={nextIsContact ? "Request a consultation →" : "Read next →"}
          headingAs="h2"
        />
      </ContentSection>

      {page.faqs.length ? (
        <ContentSection tone="feature" size="spacious" containerSize="md">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              Common questions
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>Questions parents ask</ContentHeaderTitle>
          </ContentHeader>
          <DisclosureList className={styles.faqList}>
            {page.faqs.map((faq) => (
              <DisclosureItem key={faq.question}>
                <DisclosureTrigger>
                  <DisclosureTitle>{faq.question}</DisclosureTitle>
                </DisclosureTrigger>
                <DisclosureContent>
                  <LinkedText text={faq.answer} />
                </DisclosureContent>
              </DisclosureItem>
            ))}
          </DisclosureList>
        </ContentSection>
      ) : null}

      {related.length ? (
        <ContentSection size="spacious" containerSize="xl">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              {guide.title}
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>Related reading</ContentHeaderTitle>
          </ContentHeader>
          <EditorialLinkCardGrid className={styles.cards}>
            {related.map((item) => (
              <EditorialLinkCard
                key={item.slug}
                href={guidePath(guide.slug, item.slug) as Route}
                eyebrow={GUIDE_STAGE_LABELS[item.stage]}
                title={item.title}
                description={item.summary}
                action="Read →"
              />
            ))}
          </EditorialLinkCardGrid>
          <Text variant="supporting" className={styles.hubLink}>
            <TextLink href={hubPath as Route} variant="inline">
              See every page in the {guide.title.toLowerCase()}
            </TextLink>
          </Text>
        </ContentSection>
      ) : null}

      {page.sources.length ? (
        <ContentSection size="compact" containerSize="md">
          <Stack gap="md">
            <ContentHeader align="left" gap="none">
              <ContentHeaderEyebrow variant="overline">
                Sources
              </ContentHeaderEyebrow>
              <ContentHeaderTitle>Sources for this page</ContentHeaderTitle>
            </ContentHeader>
            <ol className={styles.sources}>
              {page.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceLink}
                  >
                    {source.name}
                  </a>
                </li>
              ))}
            </ol>
          </Stack>
        </ContentSection>
      ) : null}

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
