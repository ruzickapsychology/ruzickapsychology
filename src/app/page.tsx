import Link from "next/link";
import Image from "next/image";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { HeroBadge } from "@/components/ui/hero-badge";
import { SpecialtyGlyph } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { CtaLink } from "@/components/analytics";
import { imageSrc } from "@/lib/cms-images";
import { getHomePage } from "@/lib/cms";

export default async function Home() {
  const home = await getHomePage();
  if (!home) return null;
  const heroImageSrc = imageSrc(home.hero.backgroundImage);

  return (
    <div className="rp-fade">
      {/* hero */}
      <section
        className="relative flex min-h-[760px] items-center justify-center overflow-hidden bg-cover bg-center text-center md:min-h-[840px]"
      >
        {heroImageSrc ? (
          <Image
            alt={home.hero.backgroundImage?.alt ?? ""}
            className="absolute inset-0 z-0 object-cover"
            decoding="async"
            fetchPriority="high"
            fill
            loading="eager"
            quality={72}
            sizes="100vw"
            src={heroImageSrc}
          />
        ) : null}
        <Container size="xl" className="site-grid relative z-10">
          <div className="grid-center-lg relative top-4 py-16">
            <HeroBadge />
            <div className="mt-[39px]">
              <p className="mb-5 font-sans text-[13px] font-semibold uppercase tracking-[0.24em] text-light">
                {home.hero.kicker}
              </p>
              <h1 className="mb-6 text-light">{home.hero.heading}</h1>
              <p className="body-1 mx-auto mb-9 max-w-[680px] text-light">
                {home.hero.body}
              </p>
              <CtaLink href="/contact" event="consultation_cta_click" variant="primary">
                {home.hero.cta}
              </CtaLink>
            </div>
          </div>
        </Container>
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center text-light">
          <span
            className="mono-label rp-bob inline-block text-[13px] leading-none [filter:drop-shadow(0_1px_3px_rgba(58,35,40,0.35))]"
            aria-hidden
          >
            ↓
          </span>
        </div>
      </section>
      <div id="hero-sentinel" />

      {/* specialties — quadrant layout */}
      <Section size="spacious">
        <Container size="xl" className="site-grid">
          <div className="grid-center-md mb-14 text-center">
            <p className="eyebrow">{home.specialties.eyebrow}</p>
            <h2 className="mt-4">{home.specialties.heading}</h2>
          </div>
          <div className="grid-card-2 grid-full">
            {home.specialties.items.map((s, i) => (
              <div
                key={s.title}
                className={`rp-q px-2 py-10 sm:px-10 sm:py-14 ${
                  i < 2 ? "border-b border-muted" : ""
                } ${i % 2 === 0 ? "sm:border-r sm:border-muted" : ""} ${
                  i === 2 ? "border-b sm:border-b-0" : ""
                } border-muted`}
              >
                <div className="mb-6 text-[#C79DA4]">
                  <SpecialtyGlyph icon={s.icon} size={38} />
                </div>
                <h3 className="mb-3.5">{s.title}</h3>
                <p className="body-2 max-w-md">{s.summary}</p>
              </div>
            ))}
          </div>
          <div className="grid-center-md mt-10 text-center">
            <Link
              href="/specialties"
              className="mono-label inline-block border-b border-accent pb-1 tracking-[0.06em] normal-case text-accent transition-colors hover:text-fg"
            >
              Learn more →
            </Link>
          </div>
        </Container>
      </Section>

      {/* about preview */}
      <Section size="spacious" className="bg-feature/35">
        <Container
          size="xl"
          className="site-grid items-center"
        >
          <div className="grid-split-media mx-auto w-full max-w-[300px] rounded-full border border-muted p-2 lg:justify-self-center">
            <div className="relative aspect-square w-full overflow-hidden rounded-full">
              <BackgroundImageLayer
                image={home.about.portraitImage}
                alt={home.about.portraitImage?.alt ?? "Dr. Christina Ruzicka"}
              />
            </div>
          </div>
          <div className="home-about-copy grid-split-copy text-center md:text-left">
            <p className="eyebrow">{home.about.eyebrow}</p>
            <h2 className="mt-4">{home.about.heading}</h2>
            <p className="body-1 mx-auto mt-6 max-w-[540px] md:mx-0">
              {home.about.body}
            </p>
            <Link
              href="/about"
              className="mono-label mt-7 inline-block border-b border-accent pb-1 tracking-[0.06em] normal-case text-accent transition-colors hover:text-fg"
            >
              {home.about.cta}
            </Link>
          </div>
        </Container>
      </Section>

      {/* CTA band */}
      <Section
        size="spacious"
        className="relative overflow-hidden bg-feature/35"
      >
        <BackgroundImageLayer image={home.cta.backgroundImage} />
        <Container size="xl" className="site-grid relative z-10">
          <div className="grid-center-xl rounded-none border border-muted bg-feature/90 px-8 py-20 text-center sm:px-12">
            <h2>{home.cta.heading}</h2>
            <p className="body-1 mx-auto mt-4.5 max-w-[430px]">
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
        </Container>
      </Section>
    </div>
  );
}
