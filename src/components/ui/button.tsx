import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "outline";

export function buttonClasses(variant: Variant = "primary", className = "") {
  const variants: Record<Variant, string> = {
    primary: "btn btn-primary",
    secondary: "btn btn-secondary",
    outline: "btn btn-outline",
  };
  return `${variants[variant]} ${className}`.trim();
}

export function Button({
  variant = "primary",
  className,
  ...props
}: { variant?: Variant } & ComponentProps<"button">) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  external,
  ...props
}: { variant?: Variant; external?: boolean } & ComponentProps<typeof Link>) {
  const cls = buttonClasses(variant, className);
  if (external) {
    return (
      <a
        href={String(props.href)}
        target="_blank"
        rel="noreferrer"
        className={cls}
      >
        {props.children}
      </a>
    );
  }
  return <Link className={cls} {...props} />;
}
