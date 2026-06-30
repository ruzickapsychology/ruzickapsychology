import type { Metadata } from "next";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CtaLink } from "@/components/cta-link";
import { pageMetadata } from "@/lib/seo";
import { getFAQPage } from "@/lib/cms";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Common questions about therapy with Dr. Christina Ruzicka — what she helps with, her style, first sessions, fees, and how to begin.",
  path: "/faq",
});

export default async function FAQ() {
  const faq = await getFAQPage();
  if (!faq) return null;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity:
      faq.items?.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
      })) ?? [],
  };

  return (
    <div className="rp-fade">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Section size="page">
        <Container size="md">
          <div className="text-center">
            <h1>{faq.heading}</h1>
            <p className="body-2 mx-auto mt-5 max-w-[520px]">{faq.intro}</p>
          </div>

          <div className="mt-14">
            {faq.items?.map((item) => (
              <details
                key={item._key ?? item.q}
                className="group border-muted last:border-muted border-t last:border-b"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="heading-item">{item.q}</span>
                  <span className="text-accent shrink-0 transition-transform duration-300 group-open:rotate-45">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <div className="body-2 space-y-4 pr-10 pb-7">
                  {item.a.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {faq.cta ? (
        <Section
          size="spacious"
          className="bg-feature/35 relative overflow-hidden"
        >
          <BackgroundImageLayer image={faq.cta.backgroundImage} sizes="100vw" />
          <Container size="xl" className="site-grid relative z-10">
            <div className="grid-center-xl border-muted bg-feature/90 rounded-none border px-8 py-20 text-center sm:px-12">
              <h2 className="heading-module">{faq.cta.heading}</h2>
              <p className="body-1 mx-auto mt-4 max-w-[420px]">
                {faq.cta.body}
              </p>
              <CtaLink
                href="/contact"
                event="consultation_cta_click"
                variant="primary"
                className="mt-8"
              >
                {faq.cta.cta}
              </CtaLink>
            </div>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}
