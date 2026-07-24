import type { ComponentProps } from "react";
import { Container } from "@/components/container";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const layouts = {
  site: styles.site,
  portrait: styles.portrait,
  editorial: styles.editorial,
  two: styles.two,
  twoMd: styles.twoMd,
  three: styles.three,
  four: styles.four,
  auto: styles.auto,
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
  className,
  ...props
}: {
  layout?: keyof typeof layouts;
  gap?: keyof typeof gaps;
} & ComponentProps<"div">) {
  return (
    <div
      data-slot="grid"
      data-layout={layout}
      data-gap={gap}
      className={cn(styles.root, layouts[layout], gaps[gap], className)}
      {...props}
    />
  );
}

export function GridContainer({
  size = "xl",
  layout = "site",
  gap = "gutter",
  className,
  ...props
}: {
  size?: ComponentProps<typeof Container>["size"];
  layout?: keyof typeof layouts;
  gap?: keyof typeof gaps;
} & Omit<ComponentProps<"div">, "size">) {
  return (
    <Container
      data-slot="grid-container"
      data-layout={layout}
      data-gap={gap}
      size={size}
      className={cn(styles.root, layouts[layout], gaps[gap], className)}
      {...props}
    />
  );
}
