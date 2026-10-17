import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

type TextLinkProps = {
  href: LinkProps<string>["href"];
  variant?: "navigation" | "inline";
  direction?: "forward" | "back" | "none";
} & Omit<ComponentProps<typeof Link>, "href">;

export function TextLink({
  href,
  children,
  className = "",
  variant = "navigation",
  direction = variant === "inline" ? "none" : "forward",
  ...props
}: TextLinkProps) {
  const childText = typeof children === "string" ? children.trim() : "";
  const childHasArrow = /[→›»]$/.test(childText);
  const prefix = direction === "back" ? "← " : "";
  const suffix = direction === "forward" && !childHasArrow ? " →" : "";

  return (
    <Link
      data-slot="text-link"
      data-direction={direction}
      data-variant={variant}
      href={href}
      className={cn(styles.root, className)}
      {...props}
    >
      {prefix}
      {children}
      {suffix}
    </Link>
  );
}
