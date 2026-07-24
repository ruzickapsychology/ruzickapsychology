import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const tones = {
  default: styles.toneDefault,
  raised: styles.raised,
  muted: styles.muted,
  feature: styles.feature,
  contrast: styles.contrast,
} as const;

const sizes = {
  compact: styles.compact,
  default: styles.default,
  page: styles.page,
  spacious: styles.spacious,
} as const;

export function Section({
  tone = "default",
  size = "default",
  className = "",
  ...props
}: {
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
} & ComponentProps<"section">) {
  return (
    <section
      data-slot="section"
      data-tone={tone}
      data-size={size}
      className={cn(styles.root, sizes[size], tones[tone], className)}
      {...props}
    />
  );
}
