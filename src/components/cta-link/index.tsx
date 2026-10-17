"use client";

import { track } from "@vercel/analytics";
import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants, type ButtonVariant } from "@/components/button";

type CtaLinkProps = Omit<ComponentProps<typeof Link>, "className" | "href"> & {
  href: LinkProps<string>["href"];
  event: string;
  variant?: ButtonVariant;
  className?: string;
};

export function CtaLink({
  href,
  event,
  variant = "primary",
  className,
  children,
  onClick,
  ...props
}: CtaLinkProps) {
  return (
    <Link
      {...props}
      data-slot="cta-link"
      data-variant={variant}
      href={href}
      className={buttonVariants({ variant, className })}
      onClick={(clickEvent) => {
        onClick?.(clickEvent);
        if (!clickEvent.defaultPrevented) track(event);
      }}
    >
      {children}
    </Link>
  );
}
