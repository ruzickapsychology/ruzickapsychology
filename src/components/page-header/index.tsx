import type { ComponentProps } from "react";
import { Container } from "@/components/container";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { Section } from "@/components/section";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

type ContainerWidth = "sm" | "md" | "lg" | "xl";

export function PageHeader({
  width = "md",
  className,
  children,
  ...props
}: {
  width?: ContainerWidth;
} & ComponentProps<typeof Section>) {
  return (
    <Section
      data-slot="page-header"
      size="page"
      className={className}
      {...props}
    >
      <Container size={width} className={styles.header}>
        {children}
      </Container>
    </Section>
  );
}

export function PageHeaderBreadcrumbs({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-breadcrumbs"
      className={cn(styles.breadcrumbs, className)}
      {...props}
    />
  );
}

export function PageHeaderContent(props: ComponentProps<typeof ContentHeader>) {
  return (
    <ContentHeader data-slot="page-header-content" gap="none" {...props} />
  );
}

export function PageHeaderEyebrow(
  props: ComponentProps<typeof ContentHeaderEyebrow>,
) {
  return <ContentHeaderEyebrow data-slot="page-header-eyebrow" {...props} />;
}

export function PageHeaderTitle({
  size = "display",
  ...props
}: Omit<ComponentProps<typeof ContentHeaderTitle>, "as">) {
  return (
    <ContentHeaderTitle
      data-slot="page-header-title"
      as="h1"
      size={size}
      {...props}
    />
  );
}

export function PageHeaderDescription(
  props: ComponentProps<typeof ContentHeaderDescription>,
) {
  return (
    <ContentHeaderDescription data-slot="page-header-description" {...props} />
  );
}
