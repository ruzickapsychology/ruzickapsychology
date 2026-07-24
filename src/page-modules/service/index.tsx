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
import { TextLink } from "@/components/text-link";
import { Text } from "@/components/typography";
import { getAvailabilityCtaContent } from "@/config/availability";
import type { ServicePageContent, SiteSettings } from "@/data/cms";
import { faqPageJsonLd, serviceJsonLd } from "@/config/seo";
import { serviceContactHref } from "@/config/services";
import styles from "./styles.module.css";

export function ServicePage({
  service,
  site,
}: {
  service: ServicePageContent;
  site: SiteSettings;
}) {
  const faqJsonLd = faqPageJsonLd(
    service.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answerText,
    })),
  );
  const cta = getAvailabilityCtaContent({
    status: site.availabilityStatus,
    messaging: site.availabilityMessaging,
    defaults: {
      heading: "Curious whether this could be a fit?",
      body: "Request a consultation to ask questions and talk through what you are looking for.",
      label: "Request a consultation",
    },
  });
  return (
    <PageShell>
      <JsonLd data={serviceJsonLd(service, site)} />
      <JsonLd data={faqJsonLd} />

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
        <PageHeaderContent align="left">
          <PageHeaderEyebrow>Rochester, New York</PageHeaderEyebrow>
          <PageHeaderTitle>{service.pageHeading}</PageHeaderTitle>
          <PageHeaderDescription>{service.intro}</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>

      <ContentSection size="compact" containerSize="md">
        <PortableContent value={service.overview} variant="article" />
      </ContentSection>

      <ContentSection
        tone="feature"
        size="spacious"
        layout="editorial"
        containerSize="xl"
      >
        <ContentHeader align="left" gap="none">
          <ContentHeaderEyebrow variant="overline">
            This may be a fit if…
          </ContentHeaderEyebrow>
          <ContentHeaderTitle>
            You want support with concerns such as:
          </ContentHeaderTitle>
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
          heading={cta.heading}
          body={
            <>
              {cta.body ? (
                <span className={styles.ctaBodyText}>{cta.body}</span>
              ) : null}
              <span className={styles.ctaSupportLinks}>
                <TextLink href="/pricing">Fees and insurance</TextLink>
                <TextLink href="/faq">General therapy FAQs</TextLink>
              </span>
            </>
          }
          cta={cta.label}
          href={serviceContactHref(service.slug)}
        />
      ) : null}
    </PageShell>
  );
}
