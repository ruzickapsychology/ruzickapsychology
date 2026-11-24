import { BotanicalStudy } from "@/components/botanical-study";
import { ActionGroup } from "@/components/action-group";
import { AuthorCard } from "@/components/author-card";
import type { Route } from "next";
import { BreadcrumbTrail } from "@/components/breadcrumb-trail";
import {
  ContentHeader,
  ContentHeaderActions,
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
import { PortableContent } from "@/components/portable-content";
import {
  EditorialLinkCard,
  EditorialLinkCardGrid,
} from "@/components/editorial-link-card";
import { JsonLd } from "@/components/json-ld";
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
import { Text } from "@/components/typography";
import { getAvailabilityCtaContent } from "@/config/availability";
import type {
  AboutPageContent,
  ServicePageContent,
  SiteSettings,
} from "@/data/cms";
import type { GuideContent, GuidePageContent } from "@/data/guides";
import { GUIDE_STAGE_LABELS, guidePath } from "@/lib/guides";
import {
  faqPageJsonLd,
  serviceEventsJsonLd,
  serviceJsonLd,
  upcomingSessions,
} from "@/config/seo";
import { serviceContactHref } from "@/config/services";
import { PRACTITIONER_LICENSE } from "@/config/site";
import { lastReviewedFor } from "@/config/review-dates";
import styles from "./styles.module.css";

const sessionDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/New_York",
});
const sessionTime = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});

export function ServicePage({
  service,
  site,
  about,
  practitionerReviewed,
  guide = null,
}: {
  service: ServicePageContent;
  site: SiteSettings;
  about: AboutPageContent | null;
  practitionerReviewed: boolean;
  /** Reader guide pages to feature, for services that have a guide. */
  guide?: { guide: GuideContent; pages: readonly GuidePageContent[] } | null;
}) {
  const reviewer = practitionerReviewed && about?.heading ? about : null;
  const faqJsonLd = faqPageJsonLd(
    service.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answerText,
    })),
    { path: `/specialties/${service.slug}`, reviewed: Boolean(reviewer) },
  );
  const sessions = upcomingSessions(service);
  const cta = getAvailabilityCtaContent({
    status: site.availabilityStatus,
    messaging: site.availabilityMessaging,
    consultationLabel: site.consultationCtaLabel,
    defaults: {
      heading: "Curious whether this could be a fit?",
      body: "Request a consultation to ask questions and talk through what you are looking for.",
    },
  });
  return (
    <PageShell>
      <JsonLd data={serviceJsonLd(service, site)} />
      <JsonLd data={faqJsonLd} />
      {serviceEventsJsonLd(service, site).map((event) => (
        <JsonLd key={String(event.startDate)} data={event} />
      ))}

      <PageHeader>
        <PageHeaderBreadcrumbs>
          <BreadcrumbTrail
            currentPath={`/specialties/${service.slug}`}
            items={[
              { label: "Home", href: "/" },
              { label: "Specialties", href: "/specialties" },
              { label: service.title },
            ]}
          />
        </PageHeaderBreadcrumbs>
        <PageHeaderContent variant="editorial">
          <PageHeaderEyebrow className={styles.serviceIdentity}>
            <BotanicalStudy icon={service.icon} size="compact" />
            <span>Rochester, New York</span>
          </PageHeaderEyebrow>
          <PageHeaderTitle>{service.pageHeading}</PageHeaderTitle>
          <PageHeaderDescription>{service.intro}</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>

      <ContentSection size="compact" containerSize="md">
        <Stack gap="lg">
          {reviewer?.heading ? (
            <AuthorCard
              label="Reviewed by"
              aria-label="Page reviewer"
              name={reviewer.heading}
              credentials={reviewer.credentials}
              license={PRACTITIONER_LICENSE.label}
              reviewedOn={lastReviewedFor(`/specialties/${service.slug}`)}
              image={reviewer.portraitImage}
              href="/about"
            />
          ) : null}
          <PortableContent value={service.overview} variant="article" />
        </Stack>
      </ContentSection>

      {sessions.length ? (
        <ContentSection size="compact" containerSize="md">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              Upcoming dates
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>Next meetings</ContentHeaderTitle>
          </ContentHeader>
          <ul className={styles.concernList}>
            {sessions.map((session) => (
              <li key={session._key ?? session.startsAt}>
                <Text>
                  {sessionDate.format(new Date(session.startsAt))},{" "}
                  {sessionTime.format(new Date(session.startsAt))} to{" "}
                  {sessionTime.format(new Date(session.endsAt))}
                </Text>
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}

      <ContentSection
        tone="feature"
        size="spacious"
        layout="editorial"
        containerSize="xl"
      >
        <ContentHeader align="left" gap="none">
          <ContentHeaderEyebrow variant="overline">
            Common concerns
          </ContentHeaderEyebrow>
          <ContentHeaderTitle>What brings you to therapy</ContentHeaderTitle>
        </ContentHeader>
        <ul className={styles.concernList}>
          {service.commonConcerns.map((concern) => (
            <li key={concern}>
              <Text>{concern}</Text>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection size="spacious" layout="editorial" containerSize="xl">
        <ContentHeader align="left" gap="none">
          <ContentHeaderEyebrow variant="overline">
            The approach
          </ContentHeaderEyebrow>
          <ContentHeaderTitle>{service.approachHeading}</ContentHeaderTitle>
          <ContentHeaderActions>
            <TextLink href="/about">About Dr. Christina Ruzicka</TextLink>
          </ContentHeaderActions>
        </ContentHeader>
        <PortableContent value={service.approachBody} variant="article" />
      </ContentSection>

      <ContentSection
        tone="muted"
        size="spacious"
        layout="editorial"
        containerSize="xl"
      >
        <ContentHeader align="left" gap="none">
          <ContentHeaderEyebrow variant="overline">
            What sessions can involve
          </ContentHeaderEyebrow>
          <ContentHeaderTitle>
            A thoughtful process shaped around you
          </ContentHeaderTitle>
        </ContentHeader>
        <PortableContent value={service.whatToExpect} variant="article" />
      </ContentSection>

      <ContentSection tone="feature" size="spacious" containerSize="md">
        <ContentHeader align="left" gap="none">
          <ContentHeaderEyebrow variant="overline">
            Common questions
          </ContentHeaderEyebrow>
          <ContentHeaderTitle>Questions about this service</ContentHeaderTitle>
        </ContentHeader>
        <DisclosureList className={styles.faqList}>
          {service.faqs.map((faq) => (
            <DisclosureItem key={faq._key ?? faq.question}>
              <DisclosureTrigger>
                <DisclosureTitle>{faq.question}</DisclosureTitle>
              </DisclosureTrigger>
              <DisclosureContent>
                <PortableContent value={faq.answer} variant="compact" />
              </DisclosureContent>
            </DisclosureItem>
          ))}
        </DisclosureList>
      </ContentSection>

      {service.sources.length ? (
        <ContentSection size="compact" containerSize="md">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              Sources
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>Research and sources</ContentHeaderTitle>
          </ContentHeader>
          <ul className={styles.sourcesList}>
            {service.sources.map((source) => (
              <li key={source._key ?? source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
                <Text as="span" variant="detail">
                  {source.citation}
                </Text>
              </li>
            ))}
          </ul>
        </ContentSection>
      ) : null}

      {guide ? (
        <ContentSection tone="muted" size="spacious" containerSize="xl">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              {guide.guide.title}
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>Read more before you decide</ContentHeaderTitle>
            <ContentHeaderActions>
              <TextLink href={guidePath(guide.guide.slug) as Route}>
                See the full guide
              </TextLink>
            </ContentHeaderActions>
          </ContentHeader>
          <EditorialLinkCardGrid className={styles.guideCards}>
            {guide.pages.map((page) => (
              <EditorialLinkCard
                key={page.slug}
                href={guidePath(guide.guide.slug, page.slug) as Route}
                eyebrow={GUIDE_STAGE_LABELS[page.stage]}
                title={page.title}
                description={page.summary}
                action="Read →"
              />
            ))}
          </EditorialLinkCardGrid>
        </ContentSection>
      ) : null}

      {service.relatedPosts.length ? (
        <ContentSection size="spacious" containerSize="xl">
          <ContentHeader align="left" gap="none">
            <ContentHeaderEyebrow variant="overline">
              Related reading
            </ContentHeaderEyebrow>
            <ContentHeaderTitle>
              From the Ruzicka Psychology blog
            </ContentHeaderTitle>
          </ContentHeader>
          <EditorialLinkCardGrid>
            {service.relatedPosts.map((post) => (
              <EditorialLinkCard
                key={post.slug}
                href={`/blog/${post.slug}` as Route}
                eyebrow="Article"
                title={post.title}
                description={post.excerpt}
                action="Read article →"
              />
            ))}
          </EditorialLinkCardGrid>
        </ContentSection>
      ) : null}

      {cta.heading ? (
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
                <TextLink href="/pricing">Fees and insurance</TextLink>
                <TextLink href="/faq">General therapy FAQs</TextLink>
              </ActionGroup>
            </>
          }
          cta={cta.label}
          href={serviceContactHref(service.slug)}
        />
      ) : null}
    </PageShell>
  );
}
