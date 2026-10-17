import type { ReactNode } from "react";
import { ActionGroup } from "@/components/action-group";
import { Container } from "@/components/container";
import {
  ContentHeader,
  ContentHeaderActions,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { Section } from "@/components/section";
import styles from "./styles.module.css";

export function StatusPage({
  eyebrow,
  heading,
  message,
  actions,
}: {
  eyebrow: ReactNode;
  heading: ReactNode;
  message: ReactNode;
  actions: ReactNode;
}) {
  return (
    <Section data-slot="status-page" size="page">
      <Container size="md">
        <ContentHeader gap="none" className={styles.content}>
          <ContentHeaderEyebrow>{eyebrow}</ContentHeaderEyebrow>
          <ContentHeaderTitle as="h1" size="display">
            {heading}
          </ContentHeaderTitle>
          <ContentHeaderDescription>{message}</ContentHeaderDescription>
          <ContentHeaderActions>
            <ActionGroup align="center">{actions}</ActionGroup>
          </ContentHeaderActions>
        </ContentHeader>
      </Container>
    </Section>
  );
}
