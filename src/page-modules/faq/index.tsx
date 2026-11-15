import { AuthorCard } from "@/components/author-card";
import { CtaSection } from "@/components/cta-section";
import { ContentSection } from "@/components/content-section";
import {
  DisclosureContent,
  DisclosureItem,
  DisclosureList,
  DisclosureTitle,
  DisclosureTrigger,
} from "@/components/disclosure-list";
import { JsonLd } from "@/components/json-ld";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PortableContent } from "@/components/portable-content";
import { Stack } from "@/components/stack";
import { faqPageJsonLd } from "@/config/seo";
import { PRACTITIONER_LICENSE } from "@/config/site";
import { getAvailabilityCtaContent } from "@/config/availability";
import type {
  AboutPageContent,
  FAQPageContent,
  SiteSettings,
} from "@/data/cms";

export function FAQPage({
  faq,
  site,
  about,
}: {
  faq: FAQPageContent;
  site: SiteSettings | null;
  about: AboutPageContent | null;
}) {
  const cta =
    site && faq.cta
      ? getAvailabilityCtaContent({
          status: site.availabilityStatus,
          messaging: site.availabilityMessaging,
          consultationLabel: site.consultationCtaLabel,
          defaults: {
            heading: faq.cta.heading,
            body: faq.cta.body,
          },
        })
      : null;
  const faqJsonLd = faqPageJsonLd(
    faq.items?.map((item) => ({
      question: item.q,
      answer: item.answerText,
    })) ?? [],
    { path: "/faq", reviewed: Boolean(about?.heading) },
  );

  return (
    <PageShell>
      <JsonLd data={faqJsonLd} />
      <PageHeader>
        <PageHeaderContent variant="overview">
          <PageHeaderTitle>{faq.heading}</PageHeaderTitle>
          {faq.intro ? (
            <PageHeaderDescription>{faq.intro}</PageHeaderDescription>
          ) : null}
        </PageHeaderContent>
      </PageHeader>
      <ContentSection size="spacious" containerSize="md">
        <Stack gap="lg">
          {about?.heading ? (
            <AuthorCard
              label="Reviewed by"
              aria-label="Page reviewer"
              name={about.heading}
              credentials={about.credentials}
              license={PRACTITIONER_LICENSE.label}
              image={about.portraitImage}
              href="/about"
            />
          ) : null}
          <DisclosureList>
            {faq.items?.map((item) => (
              <DisclosureItem key={item._key ?? item.q}>
                <DisclosureTrigger>
                  <DisclosureTitle as="h2">{item.q}</DisclosureTitle>
                </DisclosureTrigger>
                <DisclosureContent>
                  <PortableContent value={item.answer} variant="compact" />
                </DisclosureContent>
              </DisclosureItem>
            ))}
          </DisclosureList>
        </Stack>
      </ContentSection>

      {cta && faq.cta ? (
        <CtaSection
          phone={site?.phone}
          heading={cta.heading}
          body={cta.body}
          cta={cta.label}
          backgroundImage={faq.cta.backgroundImage}
        />
      ) : null}
    </PageShell>
  );
}
