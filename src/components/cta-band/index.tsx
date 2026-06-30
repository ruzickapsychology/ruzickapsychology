import type { LinkProps } from "next/link";
import type { ReactNode } from "react";
import { CtaLink } from "@/components/cta-link";
import { BackgroundImageLayer } from "@/components/ui/background-image-layer";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import type { SanityImageValue } from "@/lib/cms-images";
import styles from "./styles.module.css";

type CtaBandProps = {
  heading: ReactNode;
  body?: ReactNode;
  cta?: ReactNode;
  href: LinkProps<string>["href"];
  event: string;
  backgroundImage?: SanityImageValue;
  headingClassName?: string;
  bodyClassName?: string;
};

export function CtaBand({
  heading,
  body,
  cta,
  href,
  event,
  backgroundImage,
  headingClassName = styles.heading,
  bodyClassName = styles.body,
}: CtaBandProps) {
  return (
    <Section size="spacious" className={styles.section}>
      <BackgroundImageLayer image={backgroundImage} sizes="100vw" />
      <Container size="xl" className={styles.container}>
        <div className={styles.card}>
          <h2 className={headingClassName}>{heading}</h2>
          {body ? <p className={bodyClassName}>{body}</p> : null}
          {cta ? (
            <CtaLink
              href={href}
              event={event}
              variant="primary"
              className={styles.button}
            >
              {cta}
            </CtaLink>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
