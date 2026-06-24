import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { contact } from "@/content/contact";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Request a consultation with Dr. Christina Ruzicka. In-person in Rochester, NY and virtual appointments available.",
  path: "/contact",
});

export default function Contact() {
  return (
    <div className="rp-fade">
      <section
        className="image-grain flex min-h-[760px] items-center bg-cover bg-center px-6 py-36 sm:py-44 md:min-h-[840px]"
        style={{ backgroundImage: "url(/images/contact-roses.jpg)" }}
      >
        <Container
          size="xl"
          className="grid items-start gap-12 md:grid-cols-[1fr_1.15fr] md:gap-16 lg:gap-[72px]"
        >
          <div className="text-[#F1EEEB] md:sticky md:top-28">
            <p className="eyebrow text-[#F1EEEB]">{contact.eyebrow}</p>
            <h1 className="mt-4 text-[#F1EEEB]">{contact.heading}</h1>
            <p className="body-1 mt-6 max-w-[460px] text-[#E5DED9]">
              {contact.intro}
            </p>
            <div className="body-2 mt-7 space-y-1.5 text-[#E5DED9]">
              <div>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-accent-soft"
                >
                  {site.email}
                </a>
              </div>
              <div>{site.phone}</div>
            </div>
          </div>

          <ContactForm />
        </Container>
      </section>
      <div id="hero-sentinel" />

      {/* what to expect */}
      <section className="bg-feature/35 py-28 sm:py-36">
        <Container size="xl">
          <div className="mb-14 text-center">
            <p className="eyebrow">{contact.expect.eyebrow}</p>
            <h2 className="mt-4">{contact.expect.heading}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {contact.expect.steps.map((step, i) => (
              <div
                key={step.n}
                className={`p-8 ${
                  i < 3 ? "border-b border-muted" : ""
                } ${i >= 2 ? "sm:border-b-0" : ""} ${
                  i < 2 ? "lg:border-b-0" : ""
                } ${i % 2 === 0 ? "sm:border-r sm:border-muted" : ""} ${
                  i === 1 ? "lg:border-r lg:border-muted" : ""
                } border-muted`}
              >
                <div className="mono-label mb-4 text-accent">
                  {step.n}
                </div>
                <h3 className="mb-3 font-heading text-[22px] leading-tight whitespace-nowrap text-fg">
                  {step.title}
                </h3>
                <p className="body-3">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* location + hours */}
      <section className="py-24 sm:py-28">
        <Container
          size="xl"
          className="grid md:grid-cols-2"
        >
          <div className="grid md:border-r md:border-muted">
            <div className="py-10 pr-8 md:py-14 md:pr-12">
              <div className="mono-label mb-3.5 text-accent">
                Location
              </div>
              <p className="body-2 text-fg">
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                <span className="text-body/70">{site.address.note}</span>
              </p>
            </div>
            <div aria-hidden className="border-t border-muted md:mr-12" />
            <div className="py-10 pr-8 md:py-14 md:pr-12">
              <div className="mono-label mb-3.5 text-accent">Hours</div>
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
          <div className="relative min-h-[420px] overflow-hidden bg-feature">
            <iframe
              title={`Map to ${site.name}, ${site.address.line1}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${site.address.line1}, ${site.address.line2}`,
              )}&z=14&output=embed`}
              className="h-full min-h-[420px] w-full border-0 saturate-[0.55] sepia-[0.08] contrast-[0.98] brightness-[1.04]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-feature/12 mix-blend-multiply"
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
