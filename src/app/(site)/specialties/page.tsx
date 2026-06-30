import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { DividerGrid } from "@/components/ui/divider-grid";
import { PageHeader } from "@/components/ui/page-header";
import { SpecialtyGlyph } from "@/components/ui/specialty-glyph";
import { PortableContent } from "@/components/ui/portable-content";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo";
import { getSpecialtiesPage } from "@/lib/cms";
import styles from "./styles.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Specialties",
  description:
    "Individual therapy, Imago couples counseling, perinatal and postpartum support, and group therapy in Rochester, NY.",
  path: "/specialties",
});

export default async function Specialties() {
  const specialties = await getSpecialtiesPage();
  if (!specialties) notFound();

  return (
    <div className={styles.root}>
      <PageHeader
        eyebrow={specialties.eyebrow}
        heading={specialties.heading}
        intro={specialties.intro}
        sectionSize="spacious"
        layout="grid"
        headingWidth="md"
      >
        <DividerGrid
          twoColumnBreakpoint="md"
          itemClassName={styles.specialtyCell}
        >
          {specialties.items.map((s) => (
            <div key={s._key ?? s.slug}>
              <div className={styles.glyph}>
                <SpecialtyGlyph icon={s.icon} />
              </div>
              <h2 className={styles.specialtyTitle}>{s.title}</h2>
              <p className={styles.specialtySummary}>{s.summary}</p>
              {s.details.length ? (
                <div className={styles.specialtyDetails}>
                  {s.details.map((detail, detailIndex) => (
                    <p key={`${s.slug}-detail-${detailIndex}`}>{detail}</p>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </DividerGrid>
      </PageHeader>

      {/* modality band */}
      {specialties.modality ? (
        <Section size="default" className={styles.modalitySection}>
          <BackgroundImageLayer
            image={specialties.modality.backgroundImage}
            sizes="100vw"
          />
          <Container size="xl" className={styles.modalityContainer}>
            <div className={styles.modalityContent}>
              <p className={styles.modalityEyebrow}>
                {specialties.modality.eyebrow}
              </p>
              <h2 className={styles.modalityHeading}>
                {specialties.modality.heading}
              </h2>
              <PortableContent
                value={specialties.modality.body}
                className={styles.modalityBody}
              />
            </div>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}
