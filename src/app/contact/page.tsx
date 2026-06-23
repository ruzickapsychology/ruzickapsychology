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
        className="bg-cover bg-center px-6 pb-24 pt-28 sm:pt-32"
        style={{ backgroundImage: "url(/images/contact-bg.jpg)" }}
      >
        <Container
          size="xl"
          className="grid items-start gap-12 md:grid-cols-[1fr_1.15fr] md:gap-16 lg:gap-[72px]"
        >
          <div className="md:sticky md:top-28">
            <p className="eyebrow">{contact.eyebrow}</p>
            <h1 className="mt-4">{contact.heading}</h1>
            <p className="mt-6 max-w-[460px] text-lg leading-relaxed">
              {contact.intro}
            </p>
            <div className="mt-7 space-y-1.5 text-[16px] text-fg">
              <div>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-accent"
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

      {/* location + hours */}
      <section className="py-24 sm:py-28">
        <Container
          size="xl"
          className="grid gap-6 md:grid-cols-[340px_1fr]"
        >
          <div className="flex flex-col gap-6">
            <div className="rounded-[24px] border border-muted bg-surface p-9">
              <div className="mono-label mb-3.5 text-[12px] text-accent">
                Location
              </div>
              <p className="leading-relaxed text-fg">
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                <span className="text-body/70">{site.address.note}</span>
              </p>
            </div>
            <div className="rounded-[24px] border border-muted bg-surface p-9">
              <div className="mono-label mb-3.5 text-[12px] text-accent">Hours</div>
              <p className="leading-loose text-fg">
                {site.hours.map((h) => (
                  <span key={h}>
                    {h}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className="min-h-[420px] overflow-hidden rounded-[24px] border border-muted">
            <iframe
              title={`Map to ${site.name}, ${site.address.line1}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${site.address.line1}, ${site.address.line2}`,
              )}&z=14&output=embed`}
              className="h-full min-h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </div>
  );
}
