import type { ComponentProps } from "react";
import { Eyebrow, Heading, Text } from "@/components/typography";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const alignments = {
  center: styles.center,
  left: styles.left,
} as const;

const widths = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
} as const;

const gaps = {
  none: "",
  default: styles.gapDefault,
  spacious: styles.gapSpacious,
} as const;

export function ContentHeader({
  align = "center",
  width = "md",
  gap = "default",
  tone = "default",
  className,
  ...props
}: {
  align?: keyof typeof alignments;
  width?: keyof typeof widths;
  gap?: keyof typeof gaps;
  tone?: "default" | "inverse";
} & ComponentProps<"div">) {
  return (
    <div
      data-slot="content-header"
      data-align={align}
      data-tone={tone}
      className={cn(
        styles.root,
        alignments[align],
        widths[width],
        gaps[gap],
        className,
      )}
      {...props}
    />
  );
}

export function ContentHeaderEyebrow({
  className,
  variant = "section",
  ...props
}: Omit<ComponentProps<typeof Eyebrow>, "tone">) {
  return (
    <Eyebrow
      data-slot="content-header-eyebrow"
      variant={variant}
      tone="inherit"
      className={cn(styles.eyebrow, className)}
      {...props}
    />
  );
}

export function ContentHeaderTitle({
  as = "h2",
  size = "section",
  className,
  ...props
}: Omit<ComponentProps<typeof Heading>, "as" | "size" | "tone"> & {
  as?: ComponentProps<typeof Heading>["as"];
  size?: ComponentProps<typeof Heading>["size"];
}) {
  return (
    <Heading
      data-slot="content-header-title"
      as={as}
      size={size}
      tone="inherit"
      className={cn(styles.title, className)}
      {...props}
    />
  );
}

export function ContentHeaderDescription({
  className,
  variant = "lead",
  ...props
}: Omit<ComponentProps<typeof Text>, "tone">) {
  return (
    <Text
      data-slot="content-header-description"
      variant={variant}
      tone="inherit"
      className={cn(styles.description, className)}
      {...props}
    />
  );
}

export function ContentHeaderActions({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="content-header-actions"
      className={cn(styles.actions, className)}
      {...props}
    >
      {children}
    </div>
  );
}
