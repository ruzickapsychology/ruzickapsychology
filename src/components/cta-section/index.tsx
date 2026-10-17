import type { LinkProps } from "next/link";
import type { ReactNode } from "react";
import { ActionGroup } from "@/components/action-group";
import { BackgroundImageLayer } from "@/components/background-image-layer";
import {
  ContentHeader,
  ContentHeaderActions,
  ContentHeaderDescription,
  ContentHeaderTitle,
} from "@/components/content-header";
import { CtaLink } from "@/components/cta-link";
import { GridContainer } from "@/components/grid";
import { Section } from "@/components/section";
import type { SanityImageValue } from "@/config/cms-images";
import styles from "./styles.module.css";

type CtaSectionProps = {
  heading: ReactNode;
  body?: ReactNode;
  cta?: ReactNode;
  href?: LinkProps<string>["href"];
  event?: string;
  backgroundImage?: SanityImageValue;
};

export function CtaSection({
  heading,
  body,
  cta,
  href = "/contact",
  event = "consultation_cta_click",
  backgroundImage,
}: CtaSectionProps) {
  return (
    <Section
      data-slot="cta-section"
      tone="feature"
      size="spacious"
      className={styles.section}
    >
      <BackgroundImageLayer image={backgroundImage} sizes="100vw" />
      <GridContainer size="xl" className={styles.container}>
        <div data-slot="cta-section-card" className={styles.card}>
          <ContentHeader gap="none" width="sm">
            <ContentHeaderTitle size="module">{heading}</ContentHeaderTitle>
            {body ? (
              <ContentHeaderDescription>{body}</ContentHeaderDescription>
            ) : null}
            {cta ? (
              <ContentHeaderActions>
                <ActionGroup align="center">
                  <CtaLink
                    href={href}
                    event={event}
                    variant="primary"
                    className={styles.button}
                  >
                    {cta}
                  </CtaLink>
                </ActionGroup>
              </ContentHeaderActions>
            ) : null}
          </ContentHeader>
        </div>
      </GridContainer>
    </Section>
  );
}
