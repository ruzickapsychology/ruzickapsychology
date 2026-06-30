import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import {
  DisclosureItem,
  DisclosureList,
} from "@/components/ui/disclosure-list";
import { PageHeader } from "@/components/ui/page-header";
import { pageMetadata } from "@/lib/seo";
import { getFAQPage } from "@/lib/cms";
import styles from "./styles.module.css";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Common questions about therapy with Dr. Christina Ruzicka — what she helps with, her style, first sessions, fees, and how to begin.",
  path: "/faq",
});

export default async function FAQ() {
  const faq = await getFAQPage();
  if (!faq) notFound();
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
    <div className={styles.root}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHeader heading={faq.heading} intro={faq.intro}>
        <DisclosureList>
          {faq.items?.map((item) => (
            <DisclosureItem key={item._key ?? item.q} title={item.q}>
              <div className={styles.answer}>
                {item.a.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </DisclosureItem>
          ))}
        </DisclosureList>
      </PageHeader>

      {faq.cta ? (
        <CtaBand
          heading={faq.cta.heading}
          body={faq.cta.body}
          cta={faq.cta.cta}
          href="/contact"
          event="consultation_cta_click"
          backgroundImage={faq.cta.backgroundImage}
        />
      ) : null}
    </div>
  );
}
