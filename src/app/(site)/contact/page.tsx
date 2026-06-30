import type { Metadata } from "next";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { HeaderSentinel } from "@/components/ui/header-sentinel";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";
import { getContactPage, getSiteSettings } from "@/lib/cms";
import { ContactForm } from "./contact-form";
import styles from "./contact-page.module.css";

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
  if (!contact || !site) return null;

  return (
    <div className="rp-fade">
      <section
        className={`${styles.headerWash} ${styles.imageGrain} relative flex min-h-[760px] items-center overflow-hidden py-36 sm:py-44 md:min-h-[840px]`}
      >
        <BackgroundImageLayer
          image={contact.headerBackgroundImage}
          alt={contact.headerBackgroundImage?.alt ?? ""}
          eager
        />
        <Container size="xl" className="site-grid items-start">
          <div className="grid-split-half text-light md:sticky md:top-28">
            <p className="eyebrow text-light">{contact.eyebrow}</p>
            <h1 className="text-light mt-4">{contact.heading}</h1>
            <p className="body-1 text-cream mt-6 max-w-[460px]">
              {contact.intro}
            </p>
            <div className="body-2 text-cream mt-7 space-y-1.5">
              <div>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-accent-soft transition-colors"
                >
                  {site.email}
                </a>
              </div>
              <div>{site.phone}</div>
            </div>
          </div>

          <div className="grid-split-half-alt">
            <ContactForm />
          </div>
        </Container>
      </section>
      <HeaderSentinel />

      {/* what to expect */}
      {contact.expect ? (
        <Section size="spacious" className="bg-feature/35">
          <Container size="xl" className="site-grid">
            <div className="grid-center-md mb-14 text-center">
              <p className="eyebrow">{contact.expect.eyebrow}</p>
              <h2 className="mt-4">{contact.expect.heading}</h2>
            </div>
            <div className="grid-card-4 grid-full">
              {contact.expect.steps?.map((step, i) => (
                <div
                  key={step._key ?? step.n}
                  className={`p-8 ${
                    i < 3 ? "border-muted border-b" : ""
                  } ${i >= 2 ? "sm:border-b-0" : ""} ${
                    i < 2 ? "lg:border-b-0" : ""
                  } ${i % 2 === 0 ? "sm:border-muted sm:border-r" : ""} ${
                    i === 1 ? "lg:border-muted lg:border-r" : ""
                  } border-muted`}
                >
                  <div className="mono-label text-accent mb-4">{step.n}</div>
                  <h3 className="font-heading text-fg mb-3 text-[22px] leading-tight whitespace-nowrap">
                    {step.title}
                  </h3>
                  <p className="body-3">{step.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* location + hours */}
      <Section size="spacious">
        <Container size="xl" className="site-grid">
          <div className="grid-split-half md:border-muted grid md:border-r">
            <div className="py-10 pr-8 md:py-14 md:pr-12">
              <div className="mono-label text-accent mb-3.5">Location</div>
              <p className="body-2 text-fg">
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                <span className="text-body/70">{site.address.note}</span>
              </p>
            </div>
            <div aria-hidden className="border-muted border-t md:mr-12" />
            <div className="py-10 pr-8 md:py-14 md:pr-12">
              <div className="mono-label text-accent mb-3.5">Hours</div>
              <p className="body-2 text-fg">
                {site.hours.map((h) => (
                  <span key={h}>
                    {h}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="grid-split-half-alt bg-feature relative min-h-[420px] overflow-hidden">
            <iframe
              title={`Map to ${site.name}, ${site.address.line1}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${site.address.line1}, ${site.address.line2}`,
              )}&z=14&output=embed`}
              className="h-full min-h-[420px] w-full border-0 brightness-[1.04] contrast-[0.98] saturate-[0.55] sepia-[0.08]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div
              aria-hidden
              className="bg-feature/12 pointer-events-none absolute inset-0 mix-blend-multiply"
            />
          </div>
        </Container>
      </Section>
    </div>
  );
}
