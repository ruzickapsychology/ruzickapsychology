import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CtaLink } from "@/components/analytics";
import { pageMetadata } from "@/lib/seo";
import { pricing } from "@/content/pricing";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "Session fees and out-of-network insurance details for therapy with Dr. Christina Ruzicka in Rochester, NY.",
  path: "/pricing",
});

export default function Pricing() {
  return (
    <div className="rp-fade pt-16">
      <section className="py-20">
        <Container size="lg">
          <div className="mb-15 text-center">
            <p className="eyebrow">{pricing.eyebrow}</p>
            <h1 className="mt-4">{pricing.heading}</h1>
            <p className="body-2 mx-auto mt-4.5 max-w-[520px]">
              {pricing.intro}
            </p>
          </div>

          <div className="grid md:grid-cols-2">
            {/* fees */}
            <div className="border-b border-muted px-2 py-10 md:border-b-0 md:border-r md:border-muted md:py-14 md:pl-10 md:pr-16">
              <h3 className="heading-item mb-7">{pricing.fees.heading}</h3>
              <div className="space-y-5">
                {pricing.fees.items.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-4">
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
              <p className="body-3 mt-6 text-body/70">
                {pricing.fees.note}
              </p>
            </div>

            {/* insurance */}
            <div className="px-2 py-10 md:py-14 md:pl-16 md:pr-10">
              <h3 className="heading-item mb-6">
                {pricing.insurance.heading}
              </h3>
              <div className="body-2 space-y-5">
                {pricing.insurance.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section
        className="bg-cover bg-center px-6 py-24 sm:py-28"
        style={{ backgroundImage: "url(/images/cta-floral.jpg)" }}
      >
        <div className="mx-auto max-w-[1120px] rounded-none border border-muted bg-feature/90 px-8 py-20 text-center sm:px-12">
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
      </section>
    </div>
  );
}
