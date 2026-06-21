import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/content/site";
import { home } from "@/content/home";

export default function Home() {
  return (
    <div>
      <Section tone="greige" className="py-24">
        <Container className="text-center">
          <p className="mx-auto max-w-2xl text-lg leading-relaxed">
            {site.tagline}
          </p>
          <ButtonLink href="/contact" variant="primary" className="mt-8">
            Request a Consultation
          </ButtonLink>
        </Container>
      </Section>

      <Section id="services">
        <Container>
          <h2 className="text-center">Professional Therapy Services</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {home.services.map((s) => (
              <div key={s.title} className="rounded-2xl bg-greige/50 p-8">
                <h3>{s.title}</h3>
                <p className="mt-3 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="greige">
        <Container className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-start">
          <h2>{home.about.heading}</h2>
          <div>
            <p className="leading-relaxed">{home.about.body}</p>
            <Link
              href="/about"
              className="mt-6 inline-block text-rose-dark underline-offset-4 transition hover:text-ink hover:underline"
            >
              Inside the Practice →
            </Link>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-center">How We Begin</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {home.steps.map((step) => (
              <div key={step.label}>
                <h4 className="text-rose-dark">{step.label}</h4>
                <p className="mt-2 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Container size="md" className="text-center">
          <h2>{home.cta.heading}</h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed">{home.cta.body}</p>
          <ButtonLink href="/contact" variant="secondary" className="mt-8">
            Request a Consultation
          </ButtonLink>
        </Container>
      </Section>
    </div>
  );
}
