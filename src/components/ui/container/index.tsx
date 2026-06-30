import type { ComponentProps } from "react";
import styles from "./container.module.css";

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
      className={`${styles.root} ${widths[size]} ${className}`.trim()}
      {...props}
    />
  );
}
