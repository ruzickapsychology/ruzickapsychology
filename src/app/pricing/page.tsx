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
            <p className="mx-auto mt-4.5 max-w-[520px] leading-relaxed">
              {pricing.intro}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* fees */}
            <div className="rounded-[28px] border border-muted bg-surface p-12">
              <h3 className="mb-7 text-[28px]">{pricing.fees.heading}</h3>
              {pricing.fees.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between gap-4 border-t border-muted py-4"
                >
                  <div>
                    <div className="text-[17px] text-fg">{item.label}</div>
                    <div className="text-sm text-body/70">{item.detail}</div>
                  </div>
                  <div className="font-heading text-[22px] text-accent">
                    {item.price}
                  </div>
                </div>
              ))}
              <p className="mt-6 text-sm leading-relaxed text-body/70">
                {pricing.fees.note}
              </p>
            </div>

            {/* insurance */}
            <div className="rounded-[28px] bg-fg p-12 text-light/85">
              <h3 className="mb-6 text-[28px] text-light">
                {pricing.insurance.heading}
              </h3>
              <div className="space-y-5 leading-relaxed">
                {pricing.insurance.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <Container size="lg">
          <div className="rounded-[32px] border border-muted bg-feature px-8 py-18 text-center sm:py-20">
            <h2 className="text-[clamp(1.8rem,4vw,40px)]">{pricing.cta.heading}</h2>
            <p className="mx-auto mt-4 max-w-[420px] leading-relaxed">
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
      </section>
    </div>
  );
}
