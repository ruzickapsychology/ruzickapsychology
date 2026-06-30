import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import styles from "./styles.module.css";

export function NotFoundContent() {
  return (
    <Section size="page">
      <Container size="md">
        <div className={styles.content}>
          <p className={styles.eyebrow}>Not found</p>
          <h1 className={styles.heading}>This page is not available.</h1>
          <p className={styles.message}>
            The page you requested does not exist, or its content is not
            available right now.
          </p>
          <Link href="/" className={buttonClasses("primary", styles.cta)}>
            Return home
          </Link>
        </div>
      </Container>
    </Section>
  );
}
