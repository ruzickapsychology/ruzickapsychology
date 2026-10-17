import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export type ButtonTone = "default" | "inverse";

export type ButtonVariant = "primary" | "secondary" | "outline";

const variants: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  outline: styles.outline,
};

export function buttonVariants({
  variant = "primary",
  tone = "default",
  className,
}: {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  className?: string;
} = {}) {
  return cn(styles.root, variants[variant], styles[tone], className);
}

export function Button({
  variant = "primary",
  tone = "default",
  className,
  type = "button",
  ...props
}: {
  variant?: ButtonVariant;
  tone?: ButtonTone;
} & ComponentProps<"button">) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-tone={tone}
      type={type}
      className={buttonVariants({ variant, tone, className })}
      {...props}
    />
  );
}
