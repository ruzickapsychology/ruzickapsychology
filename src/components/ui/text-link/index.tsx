import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import styles from "./styles.module.css";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TextLinkProps = {
  href: LinkProps<string>["href"];
  children: ReactNode;
  className?: string;
  direction?: "forward" | "back" | "none";
};

export function TextLink({
  href,
  children,
  className = "",
  direction = "forward",
}: TextLinkProps) {
  const childText = typeof children === "string" ? children.trim() : "";
  const childHasArrow = /[→›»]$/.test(childText);
  const prefix = direction === "back" ? "← " : "";
  const suffix = direction === "forward" && !childHasArrow ? " →" : "";

  return (
    <Link href={href} className={classNames(styles.root, className)}>
      {prefix}
      {children}
      {suffix}
    </Link>
  );
}
