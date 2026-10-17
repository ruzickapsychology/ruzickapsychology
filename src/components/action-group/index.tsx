import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function ActionGroup({
  as: Tag = "div",
  align = "left",
  className,
  ...props
}: {
  as?: "div" | "span";
  align?: "left" | "center";
} & ComponentProps<"div">) {
  return (
    <Tag
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
