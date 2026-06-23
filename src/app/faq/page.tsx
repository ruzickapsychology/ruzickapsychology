import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CtaLink } from "@/components/analytics";
import { pageMetadata } from "@/lib/seo";
import { faq } from "@/content/faq";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Common questions about therapy with Dr. Christina Ruzicka — what she helps with, her style, first sessions, fees, and how to begin.",
  path: "/faq",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a.join(" ") },
  })),
};

export default function FAQ() {
  return (
    <div className="rp-fade pb-28 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container size="md">
        <div className="text-center">
          <p className="eyebrow">{faq.eyebrow}</p>
          <h1 className="mt-4">{faq.heading}</h1>
          <p className="mx-auto mt-5 max-w-[520px] leading-relaxed">{faq.intro}</p>
        </div>

        <div className="mt-14">
          {faq.items.map((item, i) => (
            <details
              key={item.q}
              className="group border-t border-muted last:border-b"
              open={i === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-heading text-[clamp(1.25rem,3vw,24px)] text-fg">
                  {item.q}
                </span>
                <span className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45">
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
              <div className="space-y-4 pb-7 pr-10 leading-relaxed">
                {item.a.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 rounded-[32px] border border-muted bg-feature px-8 py-16 text-center">
          <h2 className="text-[clamp(1.6rem,4vw,36px)]">Still have a question?</h2>
          <p className="mx-auto mt-4 max-w-[420px] leading-relaxed">
            Reach out for a free fifteen-minute consultation—no pressure, no commitment.
          </p>
          <CtaLink
            href="/contact"
            event="consultation_cta_click"
            variant="primary"
            className="mt-8"
          >
            Schedule a consultation
          </CtaLink>
        </div>
      </Container>
    </div>
  );
}
