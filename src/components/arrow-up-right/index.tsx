import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function ArrowUpRight({
  size = 12,
  className,
  ...props
}: {
  size?: number;
} & Omit<ComponentProps<"svg">, "children">) {
  return (
    <svg
      data-slot="arrow-up-right"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(styles.icon, className)}
      aria-hidden
      {...props}
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
