import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function ActionGroup({
  align = "left",
  className,
  ...props
}: {
  align?: "left" | "center";
} & ComponentProps<"div">) {
  return (
    <div
      data-slot="action-group"
      data-align={align}
      className={cn(
        styles.root,
        align === "center" && styles.center,
        className,
      )}
      {...props}
    />
  );
}
