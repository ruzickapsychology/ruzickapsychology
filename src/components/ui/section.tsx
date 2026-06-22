import type { ComponentProps } from "react";

const tones = {
  default: "",
  raised: "bg-surface",
  muted: "bg-muted/50",
  feature: "bg-feature/30",
  contrast: "bg-fg text-bg",
} as const;

export function Section({
  tone = "raised",
  className = "",
  ...props
}: { tone?: keyof typeof tones } & ComponentProps<"section">) {
  return (
    <section className={`py-20 ${tones[tone]} ${className}`.trim()} {...props} />
  );
}
