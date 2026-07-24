import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const headingSizes = {
  display: styles.headingDisplay,
  section: styles.headingSection,
  content: styles.headingContent,
  module: styles.headingModule,
  item: styles.headingItem,
} as const;

const eyebrowVariants = {
  section: styles.eyebrowSection,
  overline: styles.eyebrowOverline,
  label: styles.eyebrowLabel,
  meta: styles.eyebrowMeta,
} as const;

const textVariants = {
  lead: styles.textLead,
  body: styles.textBody,
  supporting: styles.textSupporting,
  detail: styles.textDetail,
  quote: styles.textQuote,
} as const;

const tones = {
  default: styles.toneDefault,
  accent: styles.toneAccent,
  inverse: styles.toneInverse,
  subdued: styles.toneSubdued,
  inherit: styles.toneInherit,
} as const;

const measures = {
  none: "",
  sm: styles.measureSm,
  md: styles.measureMd,
  lg: styles.measureLg,
} as const;

export function Heading({
  as: Tag,
  size,
  tone = "default",
  className,
  children,
  ...props
}: {
  as: "h1" | "h2" | "h3";
  size: keyof typeof headingSizes;
  tone?: keyof typeof tones;
  children: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Tag
      data-slot="heading"
      data-size={size}
      data-tone={tone}
      className={cn(styles.heading, headingSizes[size], tones[tone], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({
  as: Tag = "p",
  variant = "section",
  tone = "accent",
  className,
  children,
  ...props
}: {
  as?: "p" | "span" | "div";
  variant?: keyof typeof eyebrowVariants;
  tone?: keyof typeof tones;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      data-slot="eyebrow"
      data-variant={variant}
      data-tone={tone}
      className={cn(
        styles.eyebrow,
        eyebrowVariants[variant],
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

type TextProps = {
  as?: "p" | "span" | "div";
  variant?: keyof typeof textVariants;
  tone?: keyof typeof tones;
  measure?: keyof typeof measures;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as: Tag = "p",
    variant = "body",
    tone = "default",
    measure = "none",
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <Tag
      ref={ref as never}
      data-slot="text"
      data-variant={variant}
      data-tone={tone}
      data-measure={measure}
      className={cn(
        styles.text,
        textVariants[variant],
        tones[tone],
        measures[measure],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
});
