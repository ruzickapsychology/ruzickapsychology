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
import { faqPageJsonLd } from "@/config/seo";
import { getAvailabilityCtaContent } from "@/config/availability";
import type { FAQPageContent, SiteSettings } from "@/data/cms";

export function FAQPage({
  faq,
  site,
}: {
  faq: FAQPageContent;
  site: SiteSettings | null;
}) {
  const cta =
    site && faq.cta
      ? getAvailabilityCtaContent({
          status: site.availabilityStatus,
          messaging: site.availabilityMessaging,
          defaults: {
            heading: faq.cta.heading,
            body: faq.cta.body,
            label: faq.cta.cta,
          },
        })
      : null;
  const faqJsonLd = faqPageJsonLd(
    faq.items?.map((item) => ({
      question: item.q,
      answer: item.answerText,
    })) ?? [],
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
