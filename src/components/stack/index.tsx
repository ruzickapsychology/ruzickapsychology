import type { HTMLAttributes } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const gaps = {
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
} as const;

export function Stack({
  as: Tag = "div",
  gap = "md",
  className,
  ...props
}: {
  as?: "div" | "section" | "article" | "aside";
  gap?: keyof typeof gaps;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      data-slot="stack"
      data-gap={gap}
      className={cn(styles.root, gaps[gap], className)}
      {...props}
    />
  );
}
