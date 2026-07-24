import type { ComponentProps, ReactNode } from "react";
import { GridContainer } from "@/components/grid";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function ImmersivePageHeader({
  media,
  children,
  className,
  align = "center",
  ...props
}: {
  media?: ReactNode;
  children: ReactNode;
  align?: "center" | "start";
} & ComponentProps<"section">) {
  return (
    <section
      data-slot="immersive-page-header"
      data-align={align}
      className={cn(styles.root, align === "start" && styles.start, className)}
      {...props}
    >
      {media}
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
