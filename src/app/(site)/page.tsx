import Image from "next/image";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/cta-band";
import { Container } from "@/components/ui/container";
import { CircularPortrait } from "@/components/ui/circular-portrait";
import { DividerGrid } from "@/components/ui/divider-grid";
import { HeroBadge } from "@/components/ui/hero-badge";
import { HeaderSentinel } from "@/components/ui/header-sentinel";
import { PageShell } from "@/components/ui/page-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpecialtyGlyph } from "@/components/ui/specialty-glyph";
import { Section } from "@/components/ui/section";
import { TextLink } from "@/components/ui/text-link";
import { CtaLink } from "@/components/cta-link";
import { imageBlurData, imageSrc } from "@/lib/cms-images";
import { getHomePage } from "@/lib/cms";
import styles from "./styles.module.css";

export default async function Home() {
  const home = await getHomePage();
  if (!home) notFound();
  const heroImageSrc = imageSrc(home.hero.backgroundImage);
  const heroBlurData = imageBlurData(home.hero.backgroundImage);

  return (
    <PageShell>
      {/* hero */}
      <section className={styles.hero}>
        {heroImageSrc ? (
          <Image
            alt={home.hero.backgroundImage?.alt ?? ""}
            className={styles.heroImage}
            decoding="async"
            fetchPriority="high"
            fill
            loading="eager"
            placeholder={heroBlurData ? "blur" : "empty"}
            blurDataURL={heroBlurData}
            quality={75}
            sizes="100vw"
            src={heroImageSrc}
          />
        ) : null}
        <Container size="xl" className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <HeroBadge />
            <div className={styles.heroText}>
              <p className={styles.heroKicker}>{home.hero.kicker}</p>
              <h1 className={styles.heroHeading}>{home.hero.heading}</h1>
              <p className={styles.heroBody}>{home.hero.body}</p>
              <CtaLink
                href="/contact"
                event="consultation_cta_click"
                variant="primary"
              >
                {home.hero.cta}
              </CtaLink>
            </div>
          </div>
        </Container>
        <div className={styles.scrollCue}>
          <span className={styles.scrollGlyph} aria-hidden>
            ↓
          </span>
        </div>
      </section>
      <HeaderSentinel />

      {/* specialties — quadrant layout */}
      <Section size="spacious">
        <Container size="xl" className={styles.sectionGrid}>
          <SectionHeading
            eyebrow={home.specialties.eyebrow}
            heading={home.specialties.heading}
            className={styles.sectionIntro}
          />
          <DividerGrid itemClassName={styles.specialtyItem}>
            {home.specialties.items.map((s) => (
              <div key={s._key ?? s.slug}>
                <div className={styles.specialtyIcon}>
                  <SpecialtyGlyph icon={s.icon} size={38} />
                </div>
                <h3 className={styles.specialtyTitle}>{s.title}</h3>
                <p className={styles.specialtySummary}>{s.summary}</p>
              </div>
            ))}
          </DividerGrid>
          <div className={styles.centeredAction}>
            <TextLink href="/specialties">Learn more</TextLink>
          </div>
        </Container>
      </Section>

      {/* about preview */}
      <Section size="spacious" className={styles.featureSection}>
        <Container size="xl" className={styles.aboutGrid}>
          <CircularPortrait
            image={home.about.portraitImage}
            alt={home.about.portraitImage?.alt ?? "Dr. Christina Ruzicka"}
            size="sm"
            imageSizes="(min-width: 768px) 300px, 80vw"
            className={styles.aboutPortrait}
          />
          <div className={styles.aboutCopy}>
            <p className={styles.eyebrow}>{home.about.eyebrow}</p>
            <h2 className={styles.aboutHeading}>{home.about.heading}</h2>
            <p className={styles.aboutBody}>{home.about.body}</p>
            <TextLink href="/about" className={styles.aboutLink}>
              {home.about.cta}
            </TextLink>
          </div>
        </Container>
      </Section>

      {/* CTA band */}
      <CtaBand
        heading={home.cta.heading}
        body={home.cta.body}
        cta={home.cta.cta}
        href="/contact"
        event="consultation_cta_click"
        backgroundImage={home.cta.backgroundImage}
        headingClassName=""
        bodyClassName={styles.ctaBody}
      />
    </PageShell>
  );
}
