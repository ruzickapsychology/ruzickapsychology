import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function PageShell({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-shell"
      className={cn(styles.root, className)}
      {...props}
    />
  );
}
