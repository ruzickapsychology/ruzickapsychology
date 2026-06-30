import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { CircularPortrait } from "@/components/ui/circular-portrait";
import { Container } from "@/components/ui/container";
import {
  DisclosureItem,
  DisclosureList,
} from "@/components/ui/disclosure-list";
import { PageShell } from "@/components/ui/page-shell";
import { PortableContent } from "@/components/ui/portable-content";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { imageSrc } from "@/lib/cms-images";
import { pageMetadata } from "@/lib/seo";
import { getAboutPage } from "@/lib/cms";
import styles from "./styles.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Evidence-based psychotherapy tailored to your goals, with Dr. Christina Ruzicka, Psy.D., Licensed Clinical Psychologist in Rochester, NY.",
  path: "/about",
});

export default async function About() {
  const about = await getAboutPage();
  if (!about) notFound();

  return (
    <PageShell fixedHeaderOffset>
      {/* bio */}
      <Section size="default">
        <Container size="xl" className={styles.bioGrid}>
          <CircularPortrait
            image={about.portraitImage}
            alt={about.portraitImage?.alt ?? "Dr. Christina Ruzicka"}
            imageSizes="(min-width: 1024px) 360px, 85vw"
            sticky
            className={styles.bioPortrait}
          />
          <div className={styles.bioCopy}>
            <p className={styles.eyebrow}>{about.credentials}</p>
            <h1 className={styles.bioHeading}>{about.heading}</h1>
            <PortableContent value={about.intro} className={styles.intro} />

            {about.credentialGroups?.length ? (
              <DisclosureList className={styles.credentialsList}>
                {about.credentialGroups.map((group) => (
                  <Credentials
                    key={group._key ?? group.heading}
                    group={group}
                    license={group.license}
                  />
                ))}
              </DisclosureList>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* therapy space */}
      {about.space ? (
        <Section size="spacious" className={styles.featureSection}>
          <Container size="xl" className={styles.sectionGrid}>
            <SectionHeading
              eyebrow={about.space.eyebrow}
              heading={about.space.heading}
              intro={about.space.body}
              headingAs="h2"
              headingClassName={styles.spaceHeading}
              className={styles.sectionIntro}
            />

            <div className={styles.spaceGrid}>
              <div className={styles.spaceImageShell}>
                {imageSrc(about.space.exteriorImage) ? (
                  <div className={styles.spaceImageFrame}>
                    <BackgroundImageLayer
                      image={about.space.exteriorImage}
                      alt={about.space.exteriorImage?.alt ?? "Office exterior"}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className={styles.placeholder}>
                    <div>
                      <p className={styles.placeholderLabel}>Exterior Photo</p>
                      <p className={styles.placeholderBody}>
                        Placeholder for the building exterior.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.interiorImageShell}>
                <BackgroundImageLayer
                  image={about.space.interiorImage}
                  alt={
                    about.space.interiorImage?.alt ??
                    "Therapy office seating area"
                  }
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* philosophy band (replaces client testimonial — see content note) */}
      {about.philosophy ? (
        <Section
          size="default"
          id="about-quote-band"
          className={styles.quoteSection}
        >
          <BackgroundImageLayer
            image={about.philosophy.backgroundImage}
            sizes="100vw"
          />
          <div className={styles.quoteOverlay} aria-hidden />
          <Container size="xl" className={styles.quoteGrid}>
            <div className={styles.quoteContent}>
              <p className={styles.quoteKicker}>{about.philosophy.eyebrow}</p>
              <p className={styles.quoteText}>“{about.philosophy.quote}”</p>
              <p className={styles.quoteAttribution}>
                —{about.philosophy.attribution}
              </p>
            </div>
          </Container>
        </Section>
      ) : null}
    </PageShell>
  );
}

function Credentials({
  group,
  license,
}: {
  group: {
    heading: string;
    items: ReadonlyArray<{ _key?: string; title: string; detail: string }>;
  };
  license?: string;
}) {
  return (
    <DisclosureItem
      title={group.heading}
      titleClassName={styles.credentialHeading}
      bodyClassName={styles.credentialBody}
      bodySpacing={false}
    >
      {group.items.map((item) => (
        <p key={item._key ?? item.title} className={styles.credentialItem}>
          <strong className={styles.credentialTitle}>{item.title}</strong>
          <br />
          {item.detail}
        </p>
      ))}
      {license && <p className={styles.license}>{license}</p>}
    </DisclosureItem>
  );
}
