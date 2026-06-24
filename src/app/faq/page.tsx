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
    <div className="rp-fade">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container size="md" className="pb-24 pt-32 sm:pb-28">
        <div className="text-center">
          <h1>{faq.heading}</h1>
          <p className="body-2 mx-auto mt-5 max-w-[520px]">{faq.intro}</p>
        </div>

        <div className="mt-14">
          {faq.items.map((item) => (
            <details
              key={item.q}
              className="group border-t border-muted last:border-b last:border-muted"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="heading-item">
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
              <div className="body-2 space-y-4 pb-7 pr-10">
                {item.a.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </Container>

      <section
        className="bg-cover bg-center px-6 py-24 sm:py-28"
        style={{ backgroundImage: "url(/images/cta-floral.jpg)" }}
      >
        <div className="mx-auto max-w-[1120px] rounded-none border border-muted bg-feature/90 px-8 py-20 text-center sm:px-12">
          <h2 className="heading-module">Still have a question?</h2>
          <p className="body-1 mx-auto mt-4 max-w-[420px]">
            Start with a complimentary 15 minute call. No pressure, no commitment.
          </p>
          <CtaLink
            href="/contact"
            event="consultation_cta_click"
            variant="primary"
            className="mt-8"
          >
            Book a consultation
          </CtaLink>
        </div>
      </section>
    </div>
  );
}
