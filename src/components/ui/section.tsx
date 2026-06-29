import type { ComponentProps } from "react";

const tones = {
  default: "",
  raised: "bg-surface",
  muted: "bg-muted/50",
  feature: "bg-feature/30",
  contrast: "bg-fg text-bg",
} as const;

const sizes = {
  compact: "py-12 sm:py-16",
  default: "py-16 sm:py-20",
  page: "pb-20 pt-28 sm:pb-24 sm:pt-32",
  spacious: "py-20 sm:py-28 md:py-32",
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
      className={`${sizes[size]} ${tones[tone]} ${className}`.trim()}
      {...props}
    />
  );
}
