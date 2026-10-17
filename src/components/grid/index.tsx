import type { ComponentProps } from "react";
import { Container } from "@/components/container";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const layouts = {
  site: styles.site,
  single: styles.single,
  twoLg: styles.twoLg,
  portrait: styles.portrait,
  editorial: styles.editorial,
  two: styles.two,
  twoMd: styles.twoMd,
  three: styles.three,
  four: styles.four,
  auto: styles.auto,
} as const;

const alignments = {
  start: styles.alignStart,
  center: styles.alignCenter,
  stretch: styles.alignStretch,
} as const;

const gaps = {
  none: styles.gapNone,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  gutter: styles.gapGutter,
} as const;

export function Grid({
  layout = "site",
  gap = "gutter",
  align,
  className,
  ...props
}: {
  layout?: keyof typeof layouts;
  gap?: keyof typeof gaps;
  align?: keyof typeof alignments;
} & ComponentProps<"div">) {
  return (
    <div
      data-slot="grid"
      data-layout={layout}
      data-gap={gap}
      data-align={align}
      className={cn(
        styles.root,
        layouts[layout],
        gaps[gap],
        align && alignments[align],
        className,
      )}
      {...props}
    />
  );
}

export function GridContainer({
  size = "xl",
  layout = "site",
  gap = "gutter",
  align,
  className,
  ...props
}: {
  size?: ComponentProps<typeof Container>["size"];
  layout?: keyof typeof layouts;
  gap?: keyof typeof gaps;
  align?: keyof typeof alignments;
} & Omit<ComponentProps<"div">, "size">) {
  return (
    <Container
      data-slot="grid-container"
      data-layout={layout}
      data-gap={gap}
      data-align={align}
      size={size}
      className={cn(
        styles.root,
        layouts[layout],
        gaps[gap],
        align && alignments[align],
        className,
      )}
      {...props}
    />
  );
}
