import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { DividerGrid } from "@/components/ui/divider-grid";
import { HeaderSentinel } from "@/components/ui/header-sentinel";
import { PageShell } from "@/components/ui/page-shell";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/seo";
import { getContactPage, getSiteSettings } from "@/lib/cms";
import { ContactForm } from "./contact-form";
import styles from "./styles.module.css";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Request a consultation with Dr. Christina Ruzicka. In-person in Rochester, NY and virtual appointments available.",
  path: "/contact",
});

export default async function Contact() {
  const [contact, site] = await Promise.all([
    getContactPage(),
    getSiteSettings(),
  ]);
  if (!contact || !site) notFound();

  return (
    <PageShell>
      <section
        className={classNames(
          styles.header,
          styles.headerWash,
          styles.imageGrain,
        )}
      >
        <BackgroundImageLayer
          image={contact.headerBackgroundImage}
          alt={contact.headerBackgroundImage?.alt ?? ""}
          eager
        />
        <Container size="xl" className={styles.headerGrid}>
          <div className={styles.headerCopy}>
            <p className={styles.eyebrow}>{contact.eyebrow}</p>
            <h1 className={styles.headerHeading}>{contact.heading}</h1>
            <p className={styles.headerIntro}>{contact.intro}</p>
            <div className={styles.contactMethods}>
              <div>
                <a href={`mailto:${site.email}`} className={styles.contactLink}>
                  {site.email}
                </a>
              </div>
              <div>{site.phone}</div>
            </div>
          </div>

          <div className={styles.formColumn}>
            <ContactForm note={contact.formNote} />
          </div>
        </Container>
      </section>
      <HeaderSentinel />

      {/* what to expect */}
      {contact.expect ? (
        <Section size="spacious" className={styles.featureSection}>
          <Container size="xl" className={styles.sectionGrid}>
            <SectionHeading
              eyebrow={contact.expect.eyebrow}
              heading={contact.expect.heading}
              className={styles.sectionIntro}
            />
            <DividerGrid columns={4} itemClassName={styles.stepItem}>
              {contact.expect.steps?.map((step) => (
                <div key={step._key ?? step.n}>
                  <div className={styles.stepNumber}>{step.n}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              ))}
            </DividerGrid>
          </Container>
        </Section>
      ) : null}

      {/* location + hours */}
      <Section size="spacious">
        <Container size="xl" className={styles.sectionGrid}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsPanel}>
              <div className={styles.detailLabel}>Location</div>
              <p className={styles.detailText}>
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                <span className={styles.detailNote}>{site.address.note}</span>
              </p>
            </div>
            <div aria-hidden className={styles.detailDivider} />
            <div className={styles.detailsPanel}>
              <div className={styles.detailLabel}>Hours</div>
              <p className={styles.detailText}>
                {site.hours.map((h) => (
                  <span key={h}>
                    {h}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className={styles.mapShell}>
            <iframe
              title={`Map to ${site.name}, ${site.address.line1}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${site.address.line1}, ${site.address.line2}`,
              )}&z=14&output=embed`}
              className={styles.map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div aria-hidden className={styles.mapOverlay} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
