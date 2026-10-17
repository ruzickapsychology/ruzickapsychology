import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

const widths = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
} as const;

export function Container({
  size = "lg",
  className = "",
  ...props
}: { size?: keyof typeof widths } & ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      data-size={size}
      className={cn(styles.root, widths[size], className)}
      {...props}
    />
  );
}
