import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import styles from "./styles.module.css";

export function SiteNotFoundContent() {
  return (
    <Section size="page">
      <Container size="md">
        <div className={styles.content}>
          <p className={styles.eyebrow}>Page unavailable</p>
          <h1 className={styles.heading}>This page is not available.</h1>
          <p className={styles.message}>
            The requested content may be missing or temporarily unavailable.
            Please try again soon, or return home.
          </p>
          <Link href="/" className={buttonClasses("primary", styles.cta)}>
            Return home
          </Link>
        </div>
      </Container>
    </Section>
  );
}
