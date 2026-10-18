import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export type ButtonSize = "default" | "compact" | "icon";

export type ButtonTone = "default" | "inverse";

export type ButtonVariant = "primary" | "secondary" | "outline" | "quiet";

const variants: Record<ButtonVariant, string> = {
  primary: styles.primary,
  quiet: styles.quiet,
  secondary: styles.secondary,
  outline: styles.outline,
};

export function buttonVariants({
  variant = "primary",
  tone = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    styles.root,
    variants[variant],
    styles[tone],
    size === "compact" && styles.compact,
    size === "icon" && styles.icon,
    className,
  );
}

export function Button({
  variant = "primary",
  tone = "default",
  size = "default",
  className,
  type = "button",
  ...props
}: {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
} & ComponentProps<"button">) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      type={type}
      className={buttonVariants({ variant, tone, size, className })}
      {...props}
    />
  );
}
