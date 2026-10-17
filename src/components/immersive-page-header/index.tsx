import type { ComponentProps, ReactNode } from "react";
import { GridContainer } from "@/components/grid";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function ImmersivePageHeader({
  media,
  children,
  className,
  align = "center",
  readability = "none",
  ...props
}: {
  media?: ReactNode;
  children: ReactNode;
  align?: "center" | "start";
  readability?: "none" | "dark";
} & ComponentProps<"section">) {
  return (
    <section
      data-slot="immersive-page-header"
      data-align={align}
      className={cn(styles.root, align === "start" && styles.start, className)}
      {...props}
    >
      {media}
      {readability === "dark" ? (
        <div className={styles.darkWash} aria-hidden="true" />
      ) : null}
      {children}
    </section>
  );
}

export function ImmersivePageHeaderContent({
  className,
  ...props
}: ComponentProps<typeof GridContainer>) {
  return (
    <GridContainer
      data-slot="immersive-page-header-content"
      size="xl"
      className={cn(styles.content, className)}
      {...props}
    />
  );
}

export function ImmersivePageHeaderNavigation({
  className,
  ...props
}: ComponentProps<"nav">) {
  return (
    <nav
      data-slot="immersive-page-header-navigation"
      className={cn(styles.navigation, className)}
      {...props}
    />
  );
}

export function ImmersivePageHeaderJumpLink({
  className,
  children = "↓",
  ...props
}: ComponentProps<"a">) {
  return (
    <a
      data-slot="immersive-page-header-jump-link"
      className={cn(styles.jumpLink, className)}
      {...props}
    >
      {children}
    </a>
  );
}
