import type { Metadata } from "next";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CtaLink } from "@/components/analytics";
import { PortableContent } from "@/components/ui/portable-content";
import { pageMetadata } from "@/lib/seo";
import { getPricingPage } from "@/lib/cms";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Session fees and out-of-network insurance details for therapy with Dr. Christina Ruzicka in Rochester, NY.",
  path: "/pricing",
});

export default async function Pricing() {
  const pricing = await getPricingPage();
  if (!pricing) return null;

  return (
    <div className="rp-fade pt-16">
      <Section size="spacious">
        <Container size="xl" className="site-grid">
          <div className="grid-center-sm mb-15 text-center">
            <p className="eyebrow">{pricing.eyebrow}</p>
            <h1 className="mt-4">{pricing.heading}</h1>
            <p className="body-2 mx-auto mt-4.5 max-w-[520px]">
              {pricing.intro}
            </p>
          </div>

          <div className="grid-card-2 grid-center-lg">
            {/* fees */}
            {pricing.fees ? (
              <div className="border-muted md:border-muted border-b px-2 py-10 md:border-r md:border-b-0 md:py-14 md:pr-16 md:pl-10">
                <h2 className="heading-item mb-7">{pricing.fees.heading}</h2>
                <div className="space-y-5">
                  {pricing.fees.items?.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between gap-4"
                    >
                      <div>
                        <div className="body-2 text-fg">{item.label}</div>
                        <div className="body-3 text-body/70">{item.detail}</div>
                      </div>
                      <div className="heading-item text-accent">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="body-3 text-body/70 mt-6">{pricing.fees.note}</p>
              </div>
            ) : null}

            {/* insurance */}
            {pricing.insurance ? (
              <div className="px-2 py-10 md:py-14 md:pr-10 md:pl-16">
                <h2 className="heading-item mb-6">
                  {pricing.insurance.heading}
                </h2>
                <PortableContent
                  value={pricing.insurance.body}
                  className="body-2 space-y-5"
                />
              </div>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      {pricing.cta ? (
        <Section
          size="spacious"
          className="bg-feature/35 relative overflow-hidden"
        >
          <BackgroundImageLayer
            image={pricing.cta.backgroundImage}
            sizes="100vw"
          />
          <Container size="xl" className="site-grid relative z-10">
            <div className="grid-center-xl border-muted bg-feature/90 rounded-none border px-8 py-20 text-center sm:px-12">
              <h2 className="heading-module">{pricing.cta.heading}</h2>
              <p className="body-1 mx-auto mt-4 max-w-[420px]">
                {pricing.cta.body}
              </p>
              <CtaLink
                href="/contact"
                event="consultation_cta_click"
                variant="primary"
                className="mt-8"
              >
                {pricing.cta.cta}
              </CtaLink>
            </div>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}
