import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { CtaLink } from "@/components/analytics";
import { site } from "@/content/site";
import { home } from "@/content/home";

export default function Home() {
  return (
    <div>
      <Section tone="default" className="py-28 sm:py-36">
        <Container size="md" className="text-center">
          <p className="eyebrow">Therapy in Rochester, NY</p>
          <h1 className="mt-5">
            Holding it all together shouldn&rsquo;t mean carrying it alone.
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed">
            Evidence-based psychotherapy for couples seeking connection and women
            navigating maternal mental health, postpartum anxiety, and the
            seasons of change in between.
          </p>
          <CtaLink
            href="/contact"
            event="consultation_cta_click"
            variant="primary"
            className="mt-9"
          >
            Request a Consultation
          </CtaLink>
        </Container>
      </Section>

      <Section tone="feature" className="py-16">
        <Container className="text-center">
          <p className="display-statement text-3xl sm:text-4xl md:text-5xl">
            Feel heard. Feel steady. Feel like yourself again.
          </p>
        </Container>
      </Section>

      <Section id="services">
        <Container>
          <div className="text-center">
            <p className="eyebrow">Specialties</p>
            <h2 className="mt-3">Support across the arc of your story</h2>
          </div>
          <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {home.services.map((s, i) => (
              <div key={s.title} className="border-t border-muted pt-6">
                <p className="font-accent text-sm italic text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2">{s.title}</h3>
                <p className="mt-3 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="raised">
        <Container className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center">
          <div>
            <p className="eyebrow">The practice</p>
            <h2 className="mt-3">{home.about.heading}</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed">{home.about.body}</p>
            <Link
              href="/about"
              className="mt-6 inline-block font-semibold uppercase tracking-widest text-accent underline-offset-4 transition hover:text-fg hover:underline"
              style={{ fontSize: "0.8rem" }}
            >
              Inside the Practice →
            </Link>
          </div>
        </Container>
      </Section>

      <Section tone="default">
        <Container size="md" className="text-center">
          <p className="display-statement text-2xl leading-snug sm:text-3xl md:text-4xl">
            &ldquo;Therapy is a profound investment of your time, vulnerability, and
            resources&mdash;and it is one I respect deeply. My work is relational,
            warm, and active. I want to be connected to your world.&rdquo;
          </p>
          <p className="mt-7 font-accent italic text-accent">
            &mdash; {site.practitioner}
          </p>
        </Container>
      </Section>

      <Section tone="feature">
        <Container>
          <div className="text-center">
            <p className="eyebrow">Getting started</p>
            <h2 className="mt-3">How we begin</h2>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {home.steps.map((step) => (
              <div key={step.label}>
                <h4 className="text-accent">{step.label}</h4>
                <p className="mt-3 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="contrast" className="py-28">
        <Container size="md" className="text-center">
          <h2 className="display-statement">{home.cta.heading}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed">
            {home.cta.body}
          </p>
          <CtaLink
            href="/contact"
            event="consultation_cta_click"
            variant="secondary"
            className="mt-9"
          >
            Request a Consultation
          </CtaLink>
        </Container>
      </Section>
    </div>
  );
}
