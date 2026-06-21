import type { ComponentProps } from "react";

const tones = {
  cream: "bg-cream",
  offwhite: "",
  greige: "bg-greige/50",
  blue: "bg-blue/30",
  ink: "bg-ink text-cream",
} as const;

export function Section({
  tone = "cream",
  className = "",
  ...props
}: { tone?: keyof typeof tones } & ComponentProps<"section">) {
  return (
    <section className={`py-20 ${tones[tone]} ${className}`.trim()} {...props} />
  );
}
