import Link from "next/link";
import { Container } from "@/components/ui/container";
import { HeroBadge } from "@/components/ui/hero-badge";
import { SpecialtyGlyph, ArrowDown } from "@/components/ui/icons";
import { CtaLink } from "@/components/analytics";
import { home } from "@/content/home";
import { specialties } from "@/content/specialties";

export default function Home() {
  return (
    <div className="rp-fade">
      {/* hero */}
      <section
        className="relative flex min-h-[760px] items-center justify-center overflow-hidden bg-cover bg-center px-6 text-center md:min-h-[840px]"
        style={{ backgroundImage: "url(/images/hero.jpg)" }}
      >
        <div className="relative max-w-[900px] py-16">
          <HeroBadge />
          <p className="mb-5 font-sans text-[12.5px] font-semibold uppercase tracking-[0.24em] text-light">
            {home.hero.kicker}
          </p>
          <h1 className="mb-6 text-light">{home.hero.heading}</h1>
          <p className="mx-auto mb-9 max-w-[680px] text-lg leading-relaxed text-light">
            {home.hero.body}
          </p>
          <CtaLink href="/contact" event="consultation_cta_click" variant="primary">
            {home.hero.cta}
          </CtaLink>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-light">
          <ArrowDown className="rp-bob inline-block [filter:drop-shadow(0_1px_3px_rgba(58,35,40,0.35))]" />
        </div>
      </section>
      <div id="hero-sentinel" />

      {/* specialties — quadrant layout */}
      <section className="pt-24 sm:pt-28">
        <Container size="xl">
          <div className="mb-14 text-center">
            <p className="eyebrow">{home.specialties.eyebrow}</p>
            <h2 className="mt-4">{home.specialties.heading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {specialties.items.map((s, i) => (
              <div
                key={s.title}
                className={`rp-q px-2 py-10 sm:px-10 sm:py-14 ${
                  i < 2 ? "border-b border-muted" : ""
                } ${i % 2 === 0 ? "sm:border-r sm:border-muted" : ""} ${
                  i === 2 ? "border-b sm:border-b-0" : ""
                } border-muted`}
              >
                <div className="mb-6 text-accent">
                  <SpecialtyGlyph icon={s.icon} size={38} />
                </div>
                <h3 className="mb-3.5">{s.title}</h3>
                <p className="max-w-md leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* about preview */}
      <section className="py-24 sm:py-28">
        <Container
          size="xl"
          className="grid items-center gap-12 md:grid-cols-[420px_1fr] md:gap-16"
        >
          <div
            className="aspect-[1/1.06] w-full overflow-hidden rounded-[20px] bg-cover bg-center"
            style={{ backgroundImage: "url(/images/portrait.jpg)" }}
          />
          <div>
            <p className="eyebrow">{home.about.eyebrow}</p>
            <h2 className="mt-4">{home.about.heading}</h2>
            <p className="mt-6 max-w-[540px] text-lg leading-relaxed">
              {home.about.body}
            </p>
            <Link
              href="/about"
              className="mono-label mt-7 inline-block border-b border-accent pb-1 text-[12.5px] tracking-[0.06em] normal-case text-accent transition-colors hover:text-fg"
            >
              {home.about.cta}
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section
        className="bg-cover bg-center px-6 py-24 sm:py-28"
        style={{ backgroundImage: "url(/images/cta-floral.jpg)" }}
      >
        <div className="mx-auto max-w-[1120px] rounded-[32px] border border-muted bg-feature/90 px-8 py-20 text-center shadow-[0_24px_60px_rgba(58,35,40,0.22)] sm:px-12">
          <p className="eyebrow">{home.cta.eyebrow}</p>
          <h2 className="mt-4.5">{home.cta.heading}</h2>
          <p className="mx-auto mt-4.5 max-w-[430px] text-lg leading-relaxed">
            {home.cta.body}
          </p>
          <CtaLink
            href="/contact"
            event="consultation_cta_click"
            variant="primary"
            className="mt-8"
          >
            {home.cta.cta}
          </CtaLink>
        </div>
      </section>
    </div>
  );
}
