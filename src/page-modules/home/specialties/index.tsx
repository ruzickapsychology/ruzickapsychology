import { Container } from "@/components/container";
import {
  ContentHeader,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { DividerGrid } from "@/components/divider-grid";
import { Grid } from "@/components/grid";
import { Section } from "@/components/section";
import { SpecialtyCard } from "@/components/specialty-card";
import { TextLink } from "@/components/text-link";
import {
  homeSpecialtiesLayout,
  type HomeSpecialtiesLayout,
} from "@/config/home-specialties";
import { isServiceSlug, serviceHref } from "@/config/services";
import type { HomePageContent } from "@/data/cms";
import styles from "../styles.module.css";

// Keep both layouts: the original quadrant composition is an intentional
// alternative the practice may return to. See docs/explorations/specimen-cabinet.
export function HomeSpecialties({
  specialties,
  layout = homeSpecialtiesLayout,
}: {
  specialties: HomePageContent["specialties"];
  layout?: HomeSpecialtiesLayout;
}) {
  const cards = specialties.items.map((specialty) => (
    <SpecialtyCard
      key={specialty._key ?? specialty.slug}
      title={specialty.title}
      summary={specialty.summary}
      icon={specialty.icon}
      glyphSize={38}
      variant={layout === "botanical" ? "botanical" : "default"}
      href={
        specialty.pageStatus === "published" && isServiceSlug(specialty.slug)
          ? serviceHref(specialty.slug)
          : undefined
      }
    />
  ));
  return (
    <Section id="home-specialties" size="spacious">
      <Container size="xl">
        <ContentHeader align="center">
          <ContentHeaderEyebrow>{specialties.eyebrow}</ContentHeaderEyebrow>
          <ContentHeaderTitle>{specialties.heading}</ContentHeaderTitle>
        </ContentHeader>
        {layout === "quadrant" ? (
          <DividerGrid>{cards}</DividerGrid>
        ) : (
          <Grid layout="four" gap="sm" data-specimen-cabinet="true">
            {cards}
          </Grid>
        )}
        <div className={styles.centeredAction}>
          <TextLink href="/specialties">View all specialties</TextLink>
        </div>
      </Container>
    </Section>
  );
}
